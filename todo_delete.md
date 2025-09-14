
# ナレッジ削除機能の実装 (Delete)

このドキュメントでは、`GEMINI.md` で定義された主要機能要件のうち、未実装のナレッジ削除機能 (Delete) を実装する手順を解説します。

## 1. 作業ブランチの作成

まず、機能開発用のブランチを作成します。

```bash
git checkout -b feature/delete-knowledge
```

## 2. 実装手順

`GEMINI.md` の「V. モジュール分割の考え方」に従い、実装を進めます。重要な点として、データの削除はユーザーにとって破壊的な操作となるため、安全に配慮した実装が求められます。

### Step 1: ルーティングの定義 (`src/router.ts`)

最初に、HTTP リクエストの入り口となるルーティングを定義します。
GETリクエストはデータの取得にのみ用いるべき（べき等であるべき）という原則に基づき、削除処理のエンドポイントには `POST` メソッドを使用します。

1.  **コントローラーを import する**
    `src/router.ts` の上部に、後ほど作成するコントローラーの import 文を追加します。

    ```typescript:src/router.ts
    import { deleteKnowledgeController } from './controllers/delete-knowledge.controller.js';
    ```

2.  **ルートを追加する**
    `router.post('/knowledges/:knowledgeId', ...)` の下に、以下のルート定義を追加します。

    ```typescript:src/router.ts
    // ...

    router.post('/knowledges/:knowledgeId/delete', async (ctx) => {
      const userId = ctx.get('userId');
      const { knowledgeId } = ctx.req.param();

      await deleteKnowledgeController(userId, knowledgeId);

      return ctx.redirect('/');
    });
    ```
    - `POST /knowledges/:knowledgeId/delete`: 特定のナレッジを削除し、トップページにリダイレクトします。

### Step 2: モデルの実装 (`src/models/knowledge.repository.ts`)

次に、指定された `knowledgeId` に基づいて、永続化されたデータを削除する処理を実装します。
`knowledge.repository.ts` には、すでに `deleteByKnowledgeId` 関数の雛形が用意されています。これを実装しましょう。

1.  **Node.js の組み込みモジュールを import する**
    `fs/promises` から `rm` (ファイルの削除) を import します。

    ```typescript:src/models/knowledge.repository.ts
    import { glob, readFile, rm } from 'node:fs/promises';
    ```

2.  **`deleteByKnowledgeId` 関数を実装する**
    `knowledgeId` を元に `storage` ディレクトリから該当する JSON ファイルを削除します。

    ```typescript:src/models/knowledge.repository.ts
    // ...

    async function deleteByKnowledgeId(knowledgeId: string): Promise<void> {
      const path = `./storage/${knowledgeId}.json`;

      await rm(path);
    }

    export const KnowledgeRepository = {
      // ...
      deleteByKnowledgeId,
    };
    ```
    - `rm` 関数で、指定されたパスのファイルを削除します。
    - ファイルが存在しない場合、`rm` はエラーをスローしますが、ここでは簡潔さのためにエラーハンドリングを省略しています。

### Step 3: コントローラーの実装 (`src/controllers/delete-knowledge.controller.ts`)

次に、ルーティングとモデルを繋ぐコントローラーを実装します。更新機能と同様に、「自分が投稿したナレッジ」であるかを判定する認可処理が必須です。

1.  **`src/controllers/delete-knowledge.controller.ts` を作成する**
    このコントローラーは、削除対象のナレッジの所有者を確認した上で、リポジトリの削除関数を呼び出す責務を持ちます。

    ```typescript:src/controllers/delete-knowledge.controller.ts
    import { HTTPException } from 'hono/http-exception';
    import { KnowledgeRepository } from '../models/knowledge.repository.js';

    export async function deleteKnowledgeController(userId: string, knowledgeId: string) {
      const storedKnowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);

      // 認可: ログインユーザーがナレッジの作者であるかを確認
      if (storedKnowledge.authorId !== userId) {
        throw new HTTPException(403, { message: 'Forbidden' });
      }

      await KnowledgeRepository.deleteByKnowledgeId(knowledgeId);
    }
    ```
    - `patchKnowledgeController` と同様に、まず `getByKnowledgeId` でナレッジを取得し、`authorId` を検証してから削除処理を呼び出しています。

### Step 4: 既存 View の修正

ユーザーが削除機能にアクセスできるよう、編集ページに「削除」ボタンを追加します。誤操作によるデータ削除を防ぐため、ボタンはフォームとして実装し、JavaScript で確認ダイアログを表示するのが一般的です。

1.  **`src/features/KnowledgeEditFeature.tsx` を修正する**
    編集フォームの下に、削除用のフォームを追加します。

    ```tsx:src/features/KnowledgeEditFeature.tsx
    // ...
    export function KnowledgeEditFeature({ knowledge }: KnowledgeEditFeatureProps) {
      const handleDelete = (e: React.FormEvent<HTMLFormElement>) => {
        if (!window.confirm('本当にこのナレッジを削除しますか？')) {
          e.preventDefault();
        }
      };

      return (
        <Layout>
          {/* ... 更新フォーム ... */}

          <div className="mt-8 border-t border-red-400 pt-4">
            <form action={`/knowledges/${knowledge.knowledgeId}/delete`} method="POST" onSubmit={handleDelete}>
              <button
                type="submit"
                className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                このナレッジを削除する
              </button>
            </form>
          </div>
        </Layout>
      );
    }
    ```
    - 削除ボタンは、更新フォームとは別の `form` タグで囲みます。
    - `action` に削除用エンドポイントのパスを指定します。
    - `onSubmit` イベントで `handleDelete` 関数を呼び出し、`window.confirm` を使ってユーザーに最終確認を求めています。ここで「キャンセル」が選択されると `e.preventDefault()` によってフォームの送信が中止されます。

## 3. 動作確認

1.  **開発サーバーを起動する**
    ```bash
    npm run dev
    ```
2.  **編集ページにアクセスする**
    自分が作成したナレッジの編集ページ (`/knowledges/:knowledgeId/edit`) を開きます。「このナレッジを削除する」ボタンが表示されることを確認します。
3.  **ナレッジを削除する**
    削除ボタンをクリックすると、確認ダイアログが表示されます。「OK」をクリックすると、ナレッジが削除され、トップページにリダイレクトされることを確認します。
4.  **一覧ページを確認する**
    トップページで、削除したナレッジが一覧から消えていることを確認できれば成功です。

## 4. プルリクエストの作成

```bash
git add .
git commit -m "feat: add delete knowledge feature"
git push origin feature/delete-knowledge
```

これでナレッジ削除機能の実装は完了です。お疲れ様でした！
