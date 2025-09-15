# Hocus Pocus 主要機能要件 解説

このドキュメントは、Hocus Pocus の主要な機能が、どのような仕組みで動作しているかを TypeScript 初心者にも分かりやすく解説します。

## はじめに: このプロジェクトの構造

このプロジェクトは、機能ごとにファイルが分割されています。大まかには、以下のようになっています。

- **`src/router.ts`**: ユーザーからのリクエスト (例: 「このページが見たい」) を最初に受け取る場所。リクエストされた URL に応じて、どの処理を呼び出すかを決定します (ルーティング)。
- **`src/controllers`**: `router.ts` から呼び出され、具体的な処理の進行役を担います。データベースからデータを取得したり、HTML を生成したりします。
- **`src/features`**: 画面の見た目 (UI) を定義する場所。JSX という構文 (HTML に似た書き方) で、画面の構造を記述します。
- **`src/models`**: アプリケーションの核となるデータや、そのデータを操作するための処理を定義する場所。データベースとのやり取りもここで行います。

## 主要機能: ナレッジ一覧表示 (Read)

例として、すでに実装されている「ナレッジ一覧表示」機能がどのように動作するかを見ていきましょう。ユーザーがトップページにアクセスしてから、ナレッジの一覧が画面に表示されるまでの流れは、以下のようになっています。

### 1. リクエストの受付 (`src/router.ts`)

ユーザーがブラウザでトップページ (`/`) にアクセスすると、`src/router.ts` がそのリクエストを受け取ります。

```typescript
// src/router.ts

// ...

router.get('/', (ctx) => {
  const userId = ctx.get('userId');
  return ctx.html(getAllKnowledgesController(userId));
});
```

- `router.get('/', ...)` という部分が、「トップページへの GET リクエストがあった場合に、この処理を実行する」という意味です。
- `getAllKnowledgesController(userId)` という関数を呼び出し、その結果を `ctx.html()` で HTML としてユーザーに返しています。

### 2. 処理の実行 (`src/controllers/get-all-knowledges.controller.tsx`)

次に、`router.ts` から呼び出された `getAllKnowledgesController` が処理を実行します。

```typescript
// src/controllers/get-all-knowledges.controller.tsx

import { KnowledgeListFeature } from '../features/KnowledgeListFeature.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

export async function getAllKnowledgesController(userId: string) {
  // 1. データベースから全てのナレッジを取得する
  const knowledges = await KnowledgeRepository.getAll();

  // 2. 取得したナレッジを画面に表示するための UI を呼び出す
  return <KnowledgeListFeature knowledges={knowledges} userId={userId} />;
}
```

この関数は、2つの重要な処理を行っています。

1.  `KnowledgeRepository.getAll()` を呼び出して、データベース (このプロジェクトでは `storage` ディレクトリ内の JSON ファイル) から、全てのナレッジデータを取得します。
2.  取得したナレッジのデータ (`knowledges`) を、`KnowledgeListFeature` という UI コンポーネントに渡して、画面を生成します。

### 3. データベースからのデータ取得 (`src/models/knowledge.repository.ts`)

`getAllKnowledgesController` から呼び出された `KnowledgeRepository.getAll()` は、データベースからデータを取得する具体的な処理を行います。

```typescript
// src/models/knowledge.repository.ts

import { glob, readFile } from 'node:fs/promises';
import type { Knowledge } from './knowledge.model.js';

async function getAll(): Promise<Knowledge[]> {
  // 1. storage ディレクトリ内の全ての .json ファイルのパスを取得する
  const files = await Array.fromAsync(glob('./storage/**/*.json'));

  // 2. 全てのファイルの中身を読み込み、JSON として解釈する
  const knowledges = await Promise.all(files.map((file) => readFile(file, 'utf-8').then(JSON.parse)));

  // 3. 取得したナレッジの配列を返す
  return knowledges;
}

export const KnowledgeRepository = {
  // ...
  getAll,
  // ...
};
```

- `glob` という関数を使って、`storage` ディレクトリの中にある全ての `.json` ファイルを探しています。
- `readFile` という関数を使って、見つかったファイルの中身を一つずつ読み込んでいます。
- `JSON.parse` を使って、読み込んだファイルの中身 (JSON 文字列) を、TypeScript が扱えるオブジェクトの形式に変換しています。

### 4. 画面の生成 (`src/features/KnowledgeListFeature.tsx`)

最後に、`getAllKnowledgesController` が `KnowledgeListFeature` を呼び出し、取得したデータを元に画面を生成します。

```typescript
// src/features/KnowledgeListFeature.tsx

import type { Knowledge } from '../models/knowledge.model.js';
import { Layout } from './Layout.js';

// ...

export function KnowledgeListFeature({ userId, knowledges }: Props) {
  return (
    <Layout title="ナレッジ一覧">
      {/* ... */}
      {knowledges.length ? (
        <ul>
          {knowledges.map((knowledge) => (
            <li key={knowledge.knowledgeId}>{knowledge.knowledgeId}</li>
          ))}
        </ul>
      ) : (
        <p>投稿済みのナレッジは 0 件です</p>
      )}
    </Layout>
  );
}
```

- `knowledges` という配列を受け取り、`map` というメソッドを使って、配列の要素一つひとつを `<li>` タグに変換しています。
- これにより、ナレッジの数だけ `<li>` タグが生成され、一覧として画面に表示されます。

## まとめ

このように、Hocus Pocus は、ユーザーからのリクエストを `router` が受け取り、`controller` が処理を進行させ、`model` がデータベースとのやり取りを行い、`feature` が画面を生成する、という流れで動作しています。

これから皆さんが実装する「ナレッジ作成」機能も、基本的にはこの流れに沿って実装していくことになります。このドキュメントが、皆さんの実装の助けになれば幸いです。

