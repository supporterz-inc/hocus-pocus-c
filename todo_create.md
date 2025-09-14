
# ナレッジ作成機能の実装 (Create)

このドキュメントでは、`GEMINI.md` で定義された主要機能要件のうち、未実装のナレッジ作成機能 (Create) を実装する手順を解説します。

## 1. 作業ブランチの作成

まず、機能開発用のブランチを作成します。

```bash
git checkout -b feature/create-knowledge
```

## 2. 実装手順

`GEMINI.md` の「V. モジュール分割の考え方」で示されている通り、`router` → `controllers` → `features` / `models` の依存関係を意識しながら、以下の順序で実装を進めます。

### Step 1: ルーティングの定義 (`src/router.ts`)

最初に、HTTP リクエストの入り口となるルーティングを定義します。
今回は、ナレッジ作成フォームを表示するためのページ (`/knowledges/new`) と、フォームから送信されたデータを受け取ってナレッジを作成するためのエンドポイント (`/knowledges`) の 2 つを追加します。

1.  **ナレッジ作成フォームのコントローラーを import する**
    `src/router.ts` の上部に、後ほど作成するコントローラーの import 文を追加します。

    ```typescript:src/router.ts
    import { getNewKnowledgeController } from './controllers/get-new-knowledge.controller.js';
    import { postKnowledgeController } from './controllers/post-knowledge.controller.js';
    ```

2.  **ルートを追加する**
    `router.get('/', ...)` の下に、以下の 2 つのルート定義を追加します。

    ```typescript:src/router.ts
    // ...

    router.get('/knowledges/new', (ctx) => {
      const userId = ctx.get('userId');
      return ctx.html(getNewKnowledgeController(userId));
    });

    router.post('/knowledges', async (ctx) => {
      const userId = ctx.get('userId');
      const form = await ctx.req.formData();

      await postKnowledgeController({
        userId,
        content: form.get('content') as string,
      });

      return ctx.redirect('/');
    });
    ```

    - `GET /knowledges/new`: 作成フォームの HTML を返します。
    - `POST /knowledges`:
        - `ctx.req.formData()` でフォームの内容を取得します。
        - コントローラーを呼び出してナレッジを作成します。
        - `ctx.redirect('/')` でトップページにリダイレクトさせます。

### Step 2: モデルの実装 (`src/models/knowledge.repository.ts`)

次に、作成したナレッジを永続化するための処理を実装します。
`knowledge.repository.ts` には、すでに `upsert` 関数の雛形が用意されています。これを実装しましょう。

`upsert` は "update or insert" の略で、データが存在すれば更新、存在しなければ挿入する操作を指します。今回は新規作成なので、受け取った `Knowledge` オブジェクトをファイルとして保存する処理を実装します。

1.  **Node.js の組み込みモジュールを import する**
    `fs/promises` を使うことで、ファイルの書き込みを非同期で行えます。

    ```typescript:src/models/knowledge.repository.ts
    import { writeFile } from 'node:fs/promises';
    ```

2.  **`upsert` 関数を実装する**
    `Knowledge` オブジェクトを受け取り、`knowledgeId` をファイル名として `storage` ディレクトリに JSON 形式で保存します。

    ```typescript:src/models/knowledge.repository.ts
    // ...

    async function upsert(knowledge: Knowledge): Promise<void> {
      const path = `./storage/${knowledge.knowledgeId}.json`;
      const content = JSON.stringify(knowledge, null, 2);

      await writeFile(path, content, 'utf-8');
    }

    export const KnowledgeRepository = {
      // ...
      upsert,
      // ...
    };
    ```

### Step 3: View (Feature) の実装 (`src/features/KnowledgeNewFeature.tsx`)

次に、ユーザーがナレッジを記述するための UI (作成フォーム) を作成します。

1.  **`src/features/KnowledgeNewFeature.tsx` を作成する**
    `features` ディレクトリに新しいファイルを作成し、以下の内容を記述します。
    これは、Markdown を入力するための `textarea` と送信ボタンを持つ、シンプルな React コンポーネントです。

    ```tsx:src/features/KnowledgeNewFeature.tsx
    import { Layout } from './Layout.js';

    export function KnowledgeNewFeature() {
      return (
        <Layout>
          <form action="/knowledges" method="POST" className="flex flex-col gap-y-4">
            <textarea
              name="content"
              className="h-96 w-full resize-y rounded-md border border-gray-300 p-2"
              placeholder="ナレッジを Markdown 形式で記述..."
            />
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              投稿する
            </button>
          </form>
        </Layout>
      );
    }
    ```

### Step 4: コントローラーの実装

最後に、ルーティングとモデル/ビューを繋ぐコントローラーを実装します。

1.  **`src/controllers/get-new-knowledge.controller.tsx` を作成する**
    このコントローラーは、先ほど作成した `KnowledgeNewFeature` を呼び出して HTML を生成する責務を持ちます。

    ```tsx:src/controllers/get-new-knowledge.controller.tsx
    import { KnowledgeNewFeature } from '../features/KnowledgeNewFeature.js';

    export function getNewKnowledgeController(userId: string) {
      console.log('Signed-in as', userId);
      return <KnowledgeNewFeature />;
    }
    ```

2.  **`src/controllers/post-knowledge.controller.ts` を作成する**
    このコントローラーは、フォームから送信されたデータを受け取り、`Knowledge` モデルを介してナレッジを作成し、リポジトリに保存する責務を持ちます。

    ```typescript:src/controllers/post-knowledge.controller.ts
    import { Knowledge } from '../models/knowledge.model.js';
    import { KnowledgeRepository } from '../models/knowledge.repository.js';

    interface PostKnowledgeControllerProps {
      userId: string;
      content: string;
    }

    export async function postKnowledgeController({ userId, content }: PostKnowledgeControllerProps) {
      const knowledge = Knowledge.create(content, userId);
      await KnowledgeRepository.upsert(knowledge);
    }
    ```
    - `GEMINI.md` の設計通り、`Knowledge.create` でドメインオブジェクトを生成し、`KnowledgeRepository.upsert` で永続化している点に注目してください。

## 3. 動作確認

すべての実装が終わったら、実際に動作するか確認しましょう。

1.  **開発サーバーを起動する**

    ```bash
    npm run dev
    ```

2.  **作成フォームにアクセスする**
    ブラウザで `http://localhost:5173/knowledges/new` を開きます。
    Markdown を入力できるフォームが表示されるはずです。

3.  **ナレッジを投稿する**
    適当な内容を記述して「投稿する」ボタンを押してください。
    トップページ (`http://localhost:5173/`) にリダイレクトされ、今投稿したナレッジが一覧の一番上に表示されていれば成功です。

## 4. プルリクエストの作成

機能が正しく動作することを確認したら、変更をコミットしてプルリクエストを作成しましょう。

```bash
git add .
git commit -m "feat: add create knowledge feature"
git push origin feature/create-knowledge
```

これでナレッジ作成機能の実装は完了です。お疲れ様でした！
