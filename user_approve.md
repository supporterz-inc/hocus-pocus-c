
# ユーザー認証の仕組み解説

このドキュメントでは、`GEMINI.md` で定義されたユーザー認証機能が、どのように実装されているかを解説します。

このアプリケーションでは、一般的なメールアドレス/パスワード認証やセッション管理を自前で実装する代わりに、**Cloudflare Zero Trust** という外部サービスを利用して認証を実現しています。これにより、アプリケーションのコードは認証という複雑な責務から解放され、本来の機能開発に集中できるというメリットがあります。

## 1. 認証の全体的な流れ

Cloudflare Zero Trust を利用した認証は、以下の流れで実行されます。

1.  **アクセスの遮断とログイン要求**:
    ユーザーがアプリケーションにアクセスすると、手前にいる Cloudflare が通信を一度受け止め、ユーザーにログインを要求します。（Google や GitHub アカウントなど、あらかじめ設定された方法でのログインが求められます。）

2.  **認証情報の付与と転送**:
    ユーザーがログインに成功すると、Cloudflare はリクエストを Hocus Pocus のサーバーに転送します。その際、Cloudflare はリクエストの HTTP ヘッダーに **`Cf-Access-Authenticated-User-Email`** というキーで、認証されたユーザーのメールアドレスを付与します。

3.  **ミドルウェアでの認証情報取得**:
    Hocus Pocus のアプリケーション (Hono) は、すべてのリクエストをまず**ミドルウェア**で受け取ります。このミドルウェアは、リクエストヘッダーから `Cf-Access-Authenticated-User-Email` を読み取り、その値を後続の処理で利用できるように準備します。

4.  **コントローラーでのユーザーID利用**:
    各機能のコントローラーは、ミドルウェアによって準備されたユーザーID（メールアドレス）をコンテキストから取得し、「誰が操作しているか」を判断します。このIDは、ナレッジの作成者として記録されたり、更新・削除時の本人確認（認可）に使用されたりします。

## 2. 実装の解説

上記の流れが、コード上でどのように実現されているかを見ていきましょう。

### Step 1: ミドルウェアによる `userId` の設定 (`src/index.ts`)

アプリケーションのエントリーポイントである `src/index.ts` に、認証情報を処理するためのミドルウェアが定義されています。

```typescript:src/index.ts
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';

import { router } from './router.js';

const app = new Hono();

// 認証ミドルウェア
app.use('*', (c, next) => {
  // Cloudflare から渡されるヘッダー、またはローカル開発用のデフォルト値
  const userId = c.req.header('Cf-Access-Authenticated-User-Email') ?? 'local-user';
  c.set('userId', userId);

  return next();
});

app.route('/', router);
app.use('/public/*', serveStatic({ root: './' }));

export default app;
```

-   `app.use('*', ...)` は、すべてのパス (`*`) へのリクエストに対して実行されるミドルウェアを定義しています。
-   `c.req.header('Cf-Access-Authenticated-User-Email')` の部分で、Cloudflare が付与したヘッダーからユーザーのメールアドレスを取得しています。
-   `?? 'local-user'` は、ヘッダーが存在しない場合（例: ローカルでの開発時）のフォールバック処理です。この場合、`userId` は固定で `'local-user'` となります。
-   `c.set('userId', userId)` によって、取得したメールアドレスを `userId` という名前で Hono のコンテキスト (`c`) に保存しています。
-   最後に `next()` を呼び出すことで、処理を次のミドルウェアやルートハンドラに引き渡します。

### Step 2: コントローラーでの `userId` の利用 (`src/router.ts`)

ミドルウェアによってコンテキストに保存された `userId` は、各ルートハンドラで簡単に取り出すことができます。

```typescript:src/router.ts
import { Hono } from 'hono';
import { getAllKnowledgesController } from './controllers/get-all-knowledges.controller.js';

// ...

export const router = new Hono<{ Variables: Variables }>();

router.get('/', (ctx) => {
  // ミドルウェアで設定された 'userId' をコンテキストから取得
  const userId = ctx.get('userId');
  console.log('Signed-in :', userId);

  // 取得した userId をコントローラーに渡す
  return ctx.html(getAllKnowledgesController(userId));
});

// ...
```

-   `const userId = ctx.get('userId')` の一行で、Step 1 で設定したユーザーIDをコンテキストから取得しています。
-   この `userId` は、ナレッジの作成者を記録したり、更新・削除時に「操作しているユーザーがナレッジの作者本人か？」を確認したりするために、各コントローラーに引き渡されて利用されます。

## まとめ

このように、Hocus Pocus アプリケーションは、認証処理そのものを自前で実装するのではなく、Cloudflare Zero Trust という外部サービスと、Hono のミドルウェア機能を組み合わせることで、クリーンで関心事が分離された設計を実現しています。
