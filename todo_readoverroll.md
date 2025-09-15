
# ナレッジ一覧表示機能の実装 (Read)

このドキュメントでは、`GEMINI.md` で定義された主要機能要件のうち、実装済みであるナレッジ一覧表示機能 (Read) を、どのような手順で実装したかを解説します。

これはInitial Commitに含まれている機能ですが、他の機能開発と同様の形式でドキュメント化することで、アプリケーション全体の設計思想への理解を深めることを目的とします。

## 1. 作業ブランチの作成

Initial Commit の状態から作業を開始すると仮定し、機能開発用のブランチを作成します。

```bash
git checkout -b feature/read-all-knowledges
```

## 2. 実装手順

`GEMINI.md` の「V. モジュール分割の考え方」で示されている通り、`router` → `controllers` → `features` / `models` の依存関係を意識しながら、以下の順序で実装を進めます。

### Step 1: モデルの実装 (`src/models/knowledge.repository.ts`)

最初に、永続化されたすべてのナレッジを取得するための処理を実装します。
ローカル環境では、`storage` ディレクトリに保存されている JSON ファイル群がデータソースとなります。

1.  **`src/models/knowledge.repository.ts` を作成する**
    `models` ディレクトリにリポジトリファイルを作成します。

2.  **Node.js の組み込みモジュールと型定義を import する**
    `node:fs/promises` から `glob` と `readFile` を、そして `knowledge.model.ts` から `Knowledge` 型を import します。

    ```typescript:src/models/knowledge.repository.ts
    import { glob, readFile } from 'node:fs/promises';
    import type { Knowledge } from './knowledge.model.js';
    ```

3.  **`getAll` 関数を実装する**
    `storage` ディレクトリ内のすべての `.json` ファイルを検索し、その内容を読み込んで `Knowledge` オブジェクトの配列として返す関数を実装します。

    ```typescript:src/models/knowledge.repository.ts
    async function getAll(): Promise<Knowledge[]> {
      const files = await Array.fromAsync(glob('./storage/**/*.json'));

      const knowledges = await Promise.all(files.map((file) => readFile(file, 'utf-8').then(JSON.parse)));

      return knowledges;
    }
    ```
    - `glob` でファイルパスのパターンマッチングを行っています。
    - `Promise.all` と `map` を組み合わせることで、複数のファイル読み込みを効率的に並列処理しています。

4.  **`KnowledgeRepository` オブジェクトとして export する**
    他のモジュールから利用できるよう、`getAll` 関数を含むオブジェクトを `export` します。他の未実装の関数も、この時点で雛形として定義しておきます。

    ```typescript:src/models/knowledge.repository.ts
    export const KnowledgeRepository = {
      // ... (他の関数の雛形)
      getAll,
      // ...
    };
    ```

### Step 2: View (Feature) の実装 (`src/features/KnowledgeListFeature.tsx`)

次に、取得したナレッジの一覧を表示するための UI を作成します。

1.  **`src/features/KnowledgeListFeature.tsx` を作成する**
    `features` ディレクトリに新しいファイルを作成し、以下の内容を記述します。
    このコンポーネントは、`Knowledge` の配列を props として受け取り、リスト形式で表示します。

    ```tsx:src/features/KnowledgeListFeature.tsx
    import type { Knowledge } from '../models/knowledge.model.js';
    import { Layout } from './Layout.js';

    interface KnowledgeListFeatureProps {
      knowledges: Knowledge[];
      userId: string;
    }

    export function KnowledgeListFeature({ knowledges, userId }: KnowledgeListFeatureProps) {
      console.log('Signed-in as', userId);

      return (
        <Layout>
          <ul className="flex flex-col gap-y-4">
            {knowledges.map((knowledge) => (
              <li key={knowledge.knowledgeId} className="rounded-md border border-gray-300 p-4">
                <h2 className="text-lg font-bold">{knowledge.knowledgeId}</h2>
                <p className="text-sm text-gray-500">Created by: {knowledge.authorId}</p>
                {/* TODO: 詳細ページへのリンクを追加する */}
              </li>
            ))}
          </ul>
        </Layout>
      );
    }
    ```
    - `knowledges` 配列を `map` で展開し、各ナレッジの情報を `li` 要素として描画しています。
    - `key` には一意な `knowledge.knowledgeId` を指定しています。

### Step 3: コントローラーの実装 (`src/controllers/get-all-knowledges.controller.tsx`)

次に、ルーティングとモデル/ビューを繋ぐコントローラーを実装します。

1.  **`src/controllers/get-all-knowledges.controller.tsx` を作成する**
    このコントローラーは、リポジトリからナレッジを取得し、それを `KnowledgeListFeature` に渡して HTML を生成する責務を持ちます。

    ```tsx:src/controllers/get-all-knowledges.controller.tsx
    import { KnowledgeListFeature } from '../features/KnowledgeListFeature.js';
    import { KnowledgeRepository } from '../models/knowledge.repository.js';

    export async function getAllKnowledgesController(userId: string) {
      const knowledges = await KnowledgeRepository.getAll();

      return <KnowledgeListFeature knowledges={knowledges} userId={userId} />;
    }
    ```

### Step 4: ルーティングの定義 (`src/router.ts`)

最後に、HTTP リクエストの入り口となるルーティングを定義します。

1.  **`src/router.ts` を作成する**
    `Hono` を使ってルーティングを管理するファイルを作成します。

    ```typescript:src/router.ts
    import { Hono } from 'hono';
    import { getAllKnowledgesController } from './controllers/get-all-knowledges.controller.js';

    export interface Variables {
      userId: string;
    }

    export const router = new Hono<{ Variables: Variables }>();

    router.get('/', (ctx) => {
      const userId = ctx.get('userId');
      console.log('Signed-in :', userId);

      return ctx.html(getAllKnowledgesController(userId));
    });
    ```
    - `GET /` (トップページ) へのリクエストに対して、`getAllKnowledgesController` を呼び出します。
    - コントローラーが返す JSX (HTML) を `ctx.html()` でレスポンスとして返却します。
    - `ctx.get('userId')` で、認証ミドルウェアから渡されたユーザーIDを取得しています。

## 3. 動作確認

すべての実装が終わったら、実際に動作するか確認しましょう。

1.  **`storage` ディレクトリにダミーデータを用意する**
    `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.json` のような名前で、`Knowledge` 形式の JSON ファイルをいくつか配置します。

2.  **開発サーバーを起動する**

    ```bash
    npm run dev
    ```

3.  **一覧表示ページにアクセスする**
    ブラウザで `http://localhost:5173/` を開きます。
    `storage` ディレクトリに配置したナレッジが一覧表示されていれば成功です。

## 4. プルリクエストの作成

機能が正しく動作することを確認したら、変更をコミットしてプルリクエストを作成します。

```bash
git add .
git commit -m "feat: add read all knowledges feature"
git push origin feature/read-all-knowledges
```

これでナレッジ一覧表示機能の実装は完了です。
