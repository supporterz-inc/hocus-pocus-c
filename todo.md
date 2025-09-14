# ナレッジ作成機能の実装 TODO

このドキュメントは、Hocus Pocus にナレッジ作成機能を実装するための手順を解説します。

## Step 1: データベースにナレッジを保存する処理を実装する

**対象ファイル:** `src/models/knowledge.repository.ts`

まず、作成されたナレッジをデータベース (このプロジェクトでは、ローカルのファイルシステム) に保存する処理を実装します。

`src/models/knowledge.repository.ts` ファイルに、`upsert` という名前の関数が未実装の状態で定義されています。この関数を、以下のように実装してください。

```typescript
import { glob, readFile, writeFile } from 'node:fs/promises';
import type { Knowledge } from './knowledge.model.js';

// ... 既存の getAll 関数の実装 ...

async function upsert(knowledge: Knowledge): Promise<void> {
  const filePath = `./storage/${knowledge.knowledgeId}.json`;
  const content = JSON.stringify(knowledge, null, 2);
  await writeFile(filePath, content);
}

export const KnowledgeRepository = {
  // ...
  upsert,
  // ...
};
```

**解説:**

- `upsert` 関数は、`Knowledge` オブジェクトを引数に受け取ります。
- `writeFile` 関数 (Node.js の標準機能) を使って、`storage` ディレクトリに、ナレッジの ID (`knowledgeId`) をファイル名とする JSON ファイルを保存します。
- `JSON.stringify` を使って、`Knowledge` オブジェクトを JSON 形式の文字列に変換しています。

## Step 2: ナレッジ作成フォームの UI を作成する

**対象ファイル:** `src/features/KnowledgeCreateFeature.tsx` (新規作成)

次に、ユーザーがナレッジのタイトルや本文を入力するための UI (ユーザーインターフェース) を作成します。

`src/features` ディレクトリに `KnowledgeCreateFeature.tsx` という名前のファイルを新規作成し、以下の内容を記述してください。

```typescript
import { Layout } from './Layout.js';

export function KnowledgeCreateFeature() {
  return (
    <Layout title="ナレッジの新規作成">
      <form action="/knowledges" method="POST">
        <div class="flex flex-col gap-y-4">
          <div>
            <label htmlFor="content" class="block font-bold">
              本文
            </label>
            <textarea
              id="content"
              name="content"
              class="w-full h-64 p-2 border border-gray-300 rounded"
              placeholder="Markdown 形式でナレッジを記述できます"
            />
          </div>
          <button type="submit" class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
            作成する
          </button>
        </div>
      </form>
    </Layout>
  );
}
```

**解説:**

- このファイルは、React のコンポーネントによく似た、JSX という構文で UI を定義しています。
- `<form>` タグの `action` 属性と `method` 属性に注目してください。このフォームが送信されると、`/knowledges` という URL に対して、POST メソッドでリクエストが送信されます。
- `<textarea>` が、ユーザーがナレッジの本文を入力するエリアです。`name="content"` という属性によって、送信されるデータに `content` というキーで本文が含まれるようになります。

## Step 3: ナレッジ作成ページを表示する処理を実装する

**対象ファイル:** `src/controllers/get-create-knowledge.controller.tsx` (新規作成)

次に、Step 2 で作成したナレッジ作成フォームの UI を、実際にブラウザに表示するための処理を実装します。

`src/controllers` ディレクトリに `get-create-knowledge.controller.tsx` という名前のファイルを新規作成し、以下の内容を記述してください。

```typescript
import { KnowledgeCreateFeature } from '../features/KnowledgeCreateFeature.js';

export function getCreateKnowledgeController() {
  return <KnowledgeCreateFeature />;
}
```

**解説:**

- このファイルは、`getCreateKnowledgeController` という名前の関数を定義しています。
- この関数は、Step 2 で作成した `KnowledgeCreateFeature` コンポーネントを呼び出し、その結果 (HTML) を返します。

## Step 4: フォームから送信されたデータを受け取り、データベースに保存する処理を実装する

**対象ファイル:** `src/controllers/post-create-knowledge.controller.ts` (新規作成)

次に、ユーザーがフォームに入力し、送信したデータを受け取って、Step 1 で実装したデータベース保存処理を呼び出す処理を実装します。

`src/controllers` ディレクトリに `post-create-knowledge.controller.ts` という名前のファイルを新規作成し、以下の内容を記述してください。

```typescript
import { Context } from 'hono';
import { Knowledge } from '../models/knowledge.model.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';
import { Variables } from '../router.js';

export async function postCreateKnowledgeController(ctx: Context<{ Variables: Variables }>) {
  const userId = ctx.get('userId');
  const { content } = await ctx.req.parseBody<{ content: string }>();

  const knowledge = Knowledge.create(content, userId);
  await KnowledgeRepository.upsert(knowledge);

  return ctx.redirect('/');
}
```

**解説:**

- `postCreateKnowledgeController` 関数は、`ctx` というオブジェクトを引数に受け取ります。このオブジェクトには、リクエストに関する情報 (送信されたデータなど) や、レスポンスを返すためのメソッドが含まれています。
- `ctx.req.parseBody()` を使って、フォームから送信されたデータを取得しています。
- `Knowledge.create()` を使って、新しい `Knowledge` オブジェクトを作成します。`userId` は、認証情報から取得しています。
- `KnowledgeRepository.upsert()` を使って、作成した `Knowledge` オブジェクトをデータベースに保存します。
- `ctx.redirect('/')` を使って、ナレッジ一覧ページにリダイレクトしています。

## Step 5: 作成した処理を呼び出すためのルーティングを設定する

**対象ファイル:** `src/router.ts`

最後に、これまで作成してきた処理を、特定の URL と結びつけるための設定を行います。

`src/router.ts` ファイルを、以下のように編集してください。

```typescript
import { Hono } from 'hono';
import { getAllKnowledgesController } from './controllers/get-all-knowledges.controller.js';
import { getCreateKnowledgeController } from './controllers/get-create-knowledge.controller.js';
import { postCreateKnowledgeController } from './controllers/post-create-knowledge.controller.js';

export interface Variables {
  userId: string;
}

export const router = new Hono<{ Variables: Variables }>();

router.get('/', (ctx) => {
  const userId = ctx.get('userId');
  return ctx.html(getAllKnowledgesController(userId));
});

router.get('/knowledges/create', (ctx) => {
  return ctx.html(getCreateKnowledgeController());
});

router.post('/knowledges', async (ctx) => {
  return await postCreateKnowledgeController(ctx);
});
```

**解説:**

- `import` 文を追加して、作成した Controller 関数を読み込んでいます。
- `router.get('/knowledges/create', ...)` という記述によって、`/knowledges/create` という URL への GET リクエストがあった場合に、`getCreateKnowledgeController` が呼び出されるようになります。
- `router.post('/knowledges', ...)` という記述によって、`/knowledges` という URL への POST リクエストがあった場合に、`postCreateKnowledgeController` が呼び出されるようになります。

以上で、ナレッジ作成機能の実装は完了です。お疲れ様でした！