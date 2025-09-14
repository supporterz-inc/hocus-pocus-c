
# ナレッジ更新機能の実装 (Update)

このドキュメントでは、`GEMINI.md` で定義された主要機能要件のうち、未実装のナレッジ更新機能 (Update) を実装する手順を解説します。

## 1. 作業ブランチの作成

まず、機能開発用のブランチを作成します。

```bash
git checkout -b feature/update-knowledge
```

## 2. 実装手順

`GEMINI.md` の「V. モジュール分割の考え方」に従い、実装を進めます。更新機能は「特定のナレッジを取得してフォームに表示する」部分と、「フォームから送信された内容でナレッジを更新する」部分から構成されます。

### Step 1: ルーティングの定義 (`src/router.ts`)

最初に、HTTP リクエストの入り口となるルーティングを定義します。
今回は、ナレッジ編集フォームを表示するためのページ (`/knowledges/:knowledgeId/edit`) と、フォームから送信されたデータを受け取ってナレッジを更新するためのエンドポイント (`POST /knowledges/:knowledgeId`) の 2 つを追加します。

1.  **コントローラーを import する**
    `src/router.ts` の上部に、後ほど作成するコントローラーの import 文を追加します。

    ```typescript:src/router.ts
    import { getEditKnowledgeController } from './controllers/get-edit-knowledge.controller.js';
    import { patchKnowledgeController } from './controllers/patch-knowledge.controller.js';
    ```

2.  **ルートを追加する**
    `router.get('/knowledges/:knowledgeId', ...)` の下に、以下の 2 つのルート定義を追加します。

    ```typescript:src/router.ts
    // ...

    router.get('/knowledges/:knowledgeId/edit', async (ctx) => {
      const userId = ctx.get('userId');
      const { knowledgeId } = ctx.req.param();

      return ctx.html(await getEditKnowledgeController(userId, knowledgeId));
    });

    router.post('/knowledges/:knowledgeId', async (ctx) => {
      const userId = ctx.get('userId');
      const { knowledgeId } = ctx.req.param();
      const form = await ctx.req.formData();

      await patchKnowledgeController({
        userId,
        knowledgeId,
        content: form.get('content') as string,
      });

      return ctx.redirect(`/knowledges/${knowledgeId}`);
    });
    ```

    - `GET /knowledges/:knowledgeId/edit`: 編集フォームの HTML を返します。
    - `POST /knowledges/:knowledgeId`: フォームの内容でナレッジを更新し、更新されたナレッジの詳細ページにリダイレクトします。

### Step 2: モデルの実装 (`src/models/knowledge.model.ts`)

`knowledge.model.ts` には、ナレッジを更新するための `update` 関数がすでに用意されています。これは、既存のナレッジデータと新しい内容を受け取り、`updatedAt` タイムスタンプを更新した新しいナレッジオブジェクトを返すものです。今回はこれをそのまま利用します。

また、リポジトリ (`knowledge.repository.ts`) の `upsert` 関数も、指定された `knowledgeId` のファイルが存在すれば上書きするため、更新処理にそのまま利用できます。

したがって、モデルとリポジトリのコードを新たに追加・修正する必要はありません。

### Step 3: View (Feature) の実装 (`src/features/KnowledgeEditFeature.tsx`)

次に、ナレッジを編集するための UI (編集フォーム) を作成します。

1.  **`src/features/KnowledgeEditFeature.tsx` を作成する**
    `features` ディレクトリに新しいファイルを作成し、以下の内容を記述します。このコンポーネントは `Knowledge` オブジェクトを props として受け取り、その内容を `textarea` に初期値として表示します。

    ```tsx:src/features/KnowledgeEditFeature.tsx
    import type { Knowledge } from '../models/knowledge.model.js';
    import { Layout } from './Layout.js';

    interface KnowledgeEditFeatureProps {
      knowledge: Knowledge;
    }

    export function KnowledgeEditFeature({ knowledge }: KnowledgeEditFeatureProps) {
      return (
        <Layout>
          <form action={`/knowledges/${knowledge.knowledgeId}`} method="POST" className="flex flex-col gap-y-4">
            <textarea
              name="content"
              className="h-96 w-full resize-y rounded-md border border-gray-300 p-2"
              defaultValue={knowledge.content}
            />
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              更新する
            </button>
          </form>
        </Layout>
      );
    }
    ```
    - `form` の `action` 属性に、更新対象の `knowledgeId` を含んだパスを指定しています。
    - `textarea` の `defaultValue` に `knowledge.content` を渡すことで、編集前の内容をフォームに表示しています。

### Step 4: コントローラーの実装

最後に、ルーティングとモデル/ビューを繋ぐコントローラーを実装します。

1.  **`src/controllers/get-edit-knowledge.controller.tsx` を作成する**
    このコントローラーは、編集対象のナレッジを取得し、編集フォーム (`KnowledgeEditFeature`) に渡して HTML を生成します。また、「自分が投稿したナレッジ」であるかを判定する認可処理もここで行います。

    ```tsx:src/controllers/get-edit-knowledge.controller.tsx
    import { HTTPException } from 'hono/http-exception';
    import { KnowledgeEditFeature } from '../features/KnowledgeEditFeature.js';
    import { KnowledgeRepository } from '../models/knowledge.repository.js';

    export async function getEditKnowledgeController(userId: string, knowledgeId: string) {
      const knowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);

      // 認可: ログインユーザーがナレッジの作者であるかを確認
      if (knowledge.authorId !== userId) {
        throw new HTTPException(403, { message: 'Forbidden' });
      }

      return <KnowledgeEditFeature knowledge={knowledge} />;
    }
    ```

2.  **`src/controllers/patch-knowledge.controller.ts` を作成する**
    このコントローラーは、フォームから送信されたデータでナレッジを更新します。ここでも同様に認可処理が必要です。

    ```typescript:src/controllers/patch-knowledge.controller.ts
    import { HTTPException } from 'hono/http-exception';
    import { Knowledge } from '../models/knowledge.model.js';
    import { KnowledgeRepository } from '../models/knowledge.repository.js';

    interface PatchKnowledgeControllerProps {
      userId: string;
      knowledgeId: string;
      content: string;
    }

    export async function patchKnowledgeController({ userId, knowledgeId, content }: PatchKnowledgeControllerProps) {
      const storedKnowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);

      // 認可: ログインユーザーがナレッジの作者であるかを確認
      if (storedKnowledge.authorId !== userId) {
        throw new HTTPException(403, { message: 'Forbidden' });
      }

      const updatedKnowledge = Knowledge.update(storedKnowledge, content);
      await KnowledgeRepository.upsert(updatedKnowledge);
    }
    ```

### Step 5: 既存 View の修正

ユーザーが編集機能にアクセスできるよう、詳細ページに「編集」ボタンを追加します。

1.  **`src/features/KnowledgeDetailFeature.tsx` を修正する**
    ログイン中のユーザー ID とナレッジの作成者 ID を比較し、一致する場合のみ編集ボタンを表示するようにします。

    ```tsx:src/features/KnowledgeDetailFeature.tsx
    // ...
    interface KnowledgeDetailFeatureProps {
      knowledge: Knowledge;
      userId: string; // userId を props で受け取る
    }

    export function KnowledgeDetailFeature({ knowledge, userId }: KnowledgeDetailFeatureProps) {
      const isAuthor = knowledge.authorId === userId;

      return (
        <Layout>
          <article className="prose lg:prose-xl">
            {isAuthor && (
              <a href={`/knowledges/${knowledge.knowledgeId}/edit`} className="button-primary">
                編集する
              </a>
            )}
            <pre>{knowledge.content}</pre>
          </article>
        </Layout>
      );
    }
    ```

2.  **`src/controllers/get-knowledge-by-id.controller.tsx` を修正する**
    上記の変更に伴い、コントローラーから `userId` を `KnowledgeDetailFeature` に渡す必要があります。

    ```tsx:src/controllers/get-knowledge-by-id.controller.tsx
    // ...
    export async function getKnowledgeByIdController(userId: string, knowledgeId: string) {
      // ...
      const knowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);
      return <KnowledgeDetailFeature knowledge={knowledge} userId={userId} />;
    }
    ```

## 3. 動作確認

1.  **開発サーバーを起動する**
    ```bash
    npm run dev
    ```
2.  **詳細ページにアクセスする**
    自分が作成したナレッジの詳細ページを開き、「編集する」ボタンが表示されることを確認します。他人が作成したナレッジの詳細ページでは、ボタンが表示されないことを確認します。
3.  **編集ページにアクセスする**
    「編集する」ボタンをクリックすると、編集フォームが表示され、既存のナレッジの内容がテキストエリアに表示されていることを確認します。
4.  **ナレッジを更新する**
    内容を編集して「更新する」ボタンをクリックします。詳細ページにリダイレクトされ、内容が更新されていることを確認できれば成功です。

## 4. プルリクエストの作成

```bash
git add .
git commit -m "feat: add update knowledge feature"
git push origin feature/update-knowledge
```

これでナレッジ更新機能の実装は完了です。お疲れ様でした！
