Hocus Pocus | Knowledge Sharing Platform for GEEK-Project
===============================================================================

ベースとなるプロジェクトは "ニュートラルな設計" であることに重きを置いています。

これは、サマーインターンシップで形成されるチームの性質に応じて、 実装に特色が出ていくことを期待しているからです。

**"Hocus Pocus"** というプロジェクト名称自体も、「何が起こるかわからない」[^1]という観点から命名されています。


## I. Getting Started

この章に記載の項目は、セットアップ時に一度のみ実施してください：

### [Node.js](https://nodejs.org) のインストール

**※ 注意 ※** : Windows であれば "Windows Subsystem for Linux" 上で、Mac であれば "ターミナル.app" 上でコマンドを実行してください。

- 次の一文を画面内に入力し、Enter で実行する (Node.js のダウンロードとインストールが行われる)

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

- 次の一文を画面内に入力し、Enter で実行する (Node.js の有効化が行われる)

```sh
\. "$HOME/.nvm/nvm.sh"
```

- 次の一文を画面内に入力し、Enter で実行する (Node.js v24 の有効化が行われる)

```sh
nvm install 24
```

### 開発用の GitHub Repository，および依存ライブラリのダウンロード

**※ 注意 ※** : Windows であれば "Windows Subsystem for Linux" 上で、Mac であれば "ターミナル.app" 上でコマンドを実行してください。

- 次の一文を画面内に入力し、Enter で実行する (ホームディレクトリに移動する)

```sh
cd
```

- 次の一文を画面内に入力し、Enter で実行する (開発用の GitHub Repository をダウンロードする)

```sh
git clone git@github.com:supporterz-inc/hocus-pocus-a.git
                                                    b
                                                    c
                                                    ^ 末尾はチームに応じて変える
```

- 次の一文を画面内に入力し、Enter で実行する (開発用の GitHub Repository に移動する)

```sh
cd hocus-pocus-a
               b
               c
               ^ 末尾はチームに応じて変える
```

- 次の一文を画面内に入力し、Enter で実行する (依存ライブラリをダウンロードする)

```sh
npm ci
```

### [Gemini CLI](https://cloud.google.com/blog/ja/topics/developers-practitioners/introducing-gemini-cli) のインストール

**※ 注意 ※** : Windows であれば "Windows Subsystem for Linux" 上で、Mac であれば "ターミナル.app" 上でコマンドを実行してください。

- 次の一文を画面内に入力し、Enter で実行する (Gemini CLI をインストールする)

```sh
npm install -g @google/gemini-cli
```


## II. How to Use

**※ 注意 ※** : Windows であれば "Windows Subsystem for Linux" 上で、Mac であれば "ターミナル.app" 上でコマンドを実行してください。

- 次の一文を画面内に入力し、Enter で実行する (開発用の GitHub Repository に移動する)

```sh
cd ~/hocus-pocus-a
                 b
                 c
                 ^ 末尾はチームに応じて変える
```

- 次の一文を画面内に入力し、Enter で実行する (プロダクト全体をビルドする)

```sh
npm run build
```

- 次の一文を画面内に入力し、Enter で実行する (プロダクトを起動する)

```sh
npm start -- "お好きな User ID"
```

- [localhost:8080](http://localhost:8080) にアクセスする


## III. Limitation of Development

開発用の GitHub Repository には、以下の制限がかけられています：

- `main` Branch には、メンター以外のユーザーに対する書き込み保護がかけられています
- Pull-Request の Merge には、1 人以上の Approved が必要です
- Pull-Request の Merge には、Status Check の通過が必要です

これらの制限により：

1. Branch の作成 (& 開発)
2. Pull-Request の作成 (& レビュー + Status Check)
3. メンターへの最終承認 (& Merge)

... といった流れが必ず行われるようにしています。


## IV. Mission

[`GEMINI.md`](GEMINI.md) を参照しながら、チームで協力してベースアプリケーションのスコープを実装してください。


[^1]: https://dragonquest.fandom.com/wiki/Hocus_Pocus
