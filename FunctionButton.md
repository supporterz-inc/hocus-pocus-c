
# ホームページへの機能ボタン追加

このドキュメントでは、ホームページ（ナレッジ一覧画面）に「ナレッジ新規作成」画面へ遷移するためのボタンを設置する手順を解説します。これにより、各機能へのアクセス性が向上します。

## 1. 変更対象ファイル

変更対象のファイルは `src/features/KnowledgeListFeature.tsx` です。

## 2. 変更内容

以下のコードを `src/features/KnowledgeListFeature.tsx` に追記します。具体的には、`こんにちは` の段落とナレッジ一覧の間に、新規作成ページへのリンクボタンを追加します。

```tsx
      <p>
        こんにちは <span class="text-blue-500 font-bold">{userId}</span> さん
      </p>

      {/* ▼▼▼ ここから追加 ▼▼▼ */}
      <div class="my-4">
        <a href="/new" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          ナレッジを新規作成する
        </a>
      </div>
      {/* ▲▲▲ ここまで追加 ▲▲▲ */}

      {knowledges.length ? (
```

## 3. 変更後の全体コード

以下は、変更後の `src/features/KnowledgeListFeature.tsx` の全体コードです。

```tsx
import type { Knowledge } from '../models/knowledge.model.js';
import { Layout } from './Layout.js';

interface Props {
  userId: string;
  knowledges: Knowledge[];
}

export function KnowledgeListFeature({ userId, knowledges }: Props) {
  return (
    <Layout title="ナレッジ一覧">
      <p>
        こんにちは <span class="text-blue-500 font-bold">{userId}</span> さん
      </p>

      <div class="my-4">
        <a href="/new" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          ナレッジを新規作成する
        </a>
      </div>

      {knowledges.length ? (
        <ul>
          {knowledges.map((knowledge) => (
            <li key={knowledge.knowledgeId}>{knowledge.knowledgeId}</li>
          ))}
        </ul>
      ) : (
        <ul>
          <li>投稿済みのナレッジは 0 件です</li>
        </ul>
      )}
    </Layout>
  );
}
```

## 4. 解説

-   `<a>` タグを使い、ナレッジ新規作成ページ (`/new`) へのハイパーリンクを作成しています。
-   `class` 属性には [Tailwind CSS](https://tailwindcss.com/) のユーティリティクラスを指定し、ボタンの見た目を整えています。
    -   `my-4`: 上下のマージンを設けます。
    -   `bg-blue-500`: 背景色を青色にします。
    -   `hover:bg-blue-700`: マウスホバー時に背景色を濃い青色にします。
    -   `text-white`: テキスト色を白色にします。
    -   `font-bold`: テキストを太字にします。
    -   `py-2 px-4`: 上下のパディングを `0.5rem`、左右のパディングを `1rem` にします。
    -   `rounded`: 角を丸くします。

以上の手順で、ホームページから他の機能へ簡単にアクセスできるようになります。



<以下古屋追記>

bg-blue-500などを定義しているのはindex.cssなので、このファイルを参照して色や形を決める事

local:8080を開いて一番最初に開かれるファイルが
src/features/KnowledgeListFeature.tsx
だから各機能を選択するボタンを作成するならこのファイルになる




## 9/15やること
```
delete機能の追加
MarkDownの作成 (index.cssのlist-styleをnone => disc にするなど)
フロントエンド(ボタンや色等)をこだわる
```