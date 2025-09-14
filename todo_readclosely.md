
# ナレッジ詳細表示機能の実装 (Read)

このドキュメントでは、`GEMINI.md` で定義された主要機能要件のうち、未実装のナレッジ詳細表示機能 (特定のナレッジを閲覧する機能) を実装する手順を解説します。

## 1. 作業ブランチの作成

まず、機能開発用のブランチを作成します。

```bash
git checkout -b feature/read-knowledge-detail
```

## 2. 実装手順

`GEMINI.md` の「V. モジュール分割の考え方」で示されている通り、`router` → `controllers` → `features` / `models` の依存関係を意識しながら、以下の順序で実装を進めます。

### Step 1: ルーティングの定義 (`src/router.ts`)

最初に、HTTP リクエストの入り口となるルーティングを定義します。
今回は、特定のナレッジ詳細ページを表示するため、`knowledgeId` をパスパラメータとして含む動的なルート (`/knowledges/:knowledgeId`) を追加します。

1.  **ナレッジ詳細表示のコントローラーを import する**
    `src/router.ts` の上部に、後ほど作成するコントローラーの import 文を追加します。

    ```typescript:src/router.ts
    import { getKnowledgeByIdController } from './controllers/get-knowledge-by-id.controller.js';
    ```

2.  **ルートを追加する**
    `router.post('/knowledges', ...)` の下に、以下のルート定義を追加します。

    ```typescript:src/router.ts
    // ...

    router.get('/knowledges/:knowledgeId', async (ctx) => {
      const userId = ctx.get('userId');
      const { knowledgeId } = ctx.req.param();

      return ctx.html(await getKnowledgeByIdController(userId, knowledgeId));
    });
    ```

    - `GET /knowledges/:knowledgeId`: 特定のナレッジの詳細ページを表示します。
    - `ctx.req.param()` を使って、URL に含まれる `knowledgeId` を取得しています。
    - コントローラー (`getKnowledgeByIdController`) は非同期処理を含むため `await` を使用し、`router` のコールバックも `async` に変更しています。

### Step 2: モデルの実装 (`src/models/knowledge.repository.ts`)

次に、指定された `knowledgeId` に基づいて、永続化されたデータから特定のナレッジを取得する処理を実装します。
`knowledge.repository.ts` には、すでに `getByKnowledgeId` 関数の雛形が用意されています。これを実装しましょう。

1.  **`getByKnowledgeId` 関数を実装する**
    `knowledgeId` を元に `storage` ディレクトリから該当する JSON ファイルを読み込み、`Knowledge` オブジェクトとして返します。

    ```typescript:src/models/knowledge.repository.ts
    // ...
    import { readFile } from 'node:fs/promises'; // glob の隣に readFile を追加

    // ...

    async function getByKnowledgeId(knowledgeId: string): Promise<Knowledge> {
      const path = `./storage/${knowledgeId}.json`;
      const content = await readFile(path, 'utf-8');

      return JSON.parse(content);
    }

    export const KnowledgeRepository = {
      getByKnowledgeId,
      // ...
    };
    ```
    - `readFile` でファイルを非同期に読み込み、`JSON.parse` でオブジェクトに変換しています。
    - ファイルが存在しない場合などのエラーハンドリングは、ここでは簡略化しています。

### Step 3: View (Feature) の実装 (`src/features/KnowledgeDetailFeature.tsx`)

次に、ナレッジの詳細情報を表示するための UI を作成します。

1.  **`src/features/KnowledgeDetailFeature.tsx` を作成する**
    `features` ディレクトリに新しいファイルを作成し、以下の内容を記述します。
    このコンポーネントは、`Knowledge` オブジェクトを props として受け取り、その内容を表示します。

    ```tsx:src/features/KnowledgeDetailFeature.tsx
    import type { Knowledge } from '../models/knowledge.model.js';
    import { Layout } from './Layout.js';

    interface KnowledgeDetailFeatureProps {
      knowledge: Knowledge;
    }

    export function KnowledgeDetailFeature({ knowledge }: KnowledgeDetailFeatureProps) {
      return (
        <Layout>
          <article className="prose lg:prose-xl">
            {/* TODO: (学生向け) Markdown を HTML に変換して表示する */}
            <pre>{knowledge.content}</pre>
          </article>
        </Layout>
      );
    }
    ```
    - ここでは `pre` タグを使って、Markdown テキストをそのまま表示しています。
    - `prose` や `prose-xl` は、Tailwind CSS の `typography` プラグインによるクラスで、記事コンテンツの見た目を整えるものです。(今回はまだセットアップしていませんが、今後の拡張を見越して記述しています)

### Step 4: コントローラーの実装 (`src/controllers/get-knowledge-by-id.controller.tsx`)

最後に、ルーティングとモデル/ビューを繋ぐコントローラーを実装します。

1.  **`src/controllers/get-knowledge-by-id.controller.tsx` を作成する**
    このコントローラーは、`knowledgeId` を使ってリポジトリからナレッジを取得し、それを `KnowledgeDetailFeature` に渡して HTML を生成する責務を持ちます。

    ```tsx:src/controllers/get-knowledge-by-id.controller.tsx
    import { KnowledgeDetailFeature } from '../features/KnowledgeDetailFeature.js';
    import { KnowledgeRepository } from '../models/knowledge.repository.js';

    export async function getKnowledgeByIdController(userId: string, knowledgeId: string) {
      console.log('Signed-in as', userId);

      const knowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);

      return <KnowledgeDetailFeature knowledge={knowledge} />;
    }
    ```
    - `KnowledgeRepository.getByKnowledgeId` を呼び出し、`knowledgeId` に一致するナレッジを取得します。
    - 取得した `knowledge` オブジェクトを `KnowledgeDetailFeature` コンポーネントに渡しています。

## 3. 動作確認

すべての実装が終わったら、実際に動作するか確認しましょう。

1.  **開発サーバーを起動する**

    ```bash
    npm run dev
    ```

2.  **ナレッジ一覧ページにアクセスする**
    ブラウザで `http://localhost:5173/` を開きます。
    ナレッジ一覧の各項目が、詳細ページへのリンク (`<a href="/knowledges/...">`) になっていることを確認します。（注: このリンク化は `KnowledgeListFeature.tsx` の修正が必要です。今回は手動で URL にアクセスします。）

3.  **詳細ページにアクセスする**
    `storage` ディレクトリにある JSON ファイルのファイル名 (例: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.json`) をコピーし、その `knowledgeId` を使って `http://localhost:5173/knowledges/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` のように URL を直接入力してアクセスします。

    ナレッジの内容が表示されれば成功です。

## 4. プルリクエストの作成

機能が正しく動作することを確認したら、変更をコミットしてプルリクエストを作成しましょう。

```bash
git add .
git commit -m "feat: add read knowledge detail feature"
git push origin feature/read-knowledge-detail
```

これでナレッジ詳細表示機能の実装は完了です。お疲れ様でした！
