# 覚書

## 環境変数

### パッケージを使用

* npm i dotenv
* app.tsに「require("dotenv").config();」

## mysqlの操作

### mysql 初期パスワードの変更

必ずパスワードが必要で初期パスワード忘れた場合に必要

* サービスから停止
* [mysql-init.txt]を作成
  * ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';
* 読み込ませて実行
  * mysqld --defaults-file="C:\\ProgramData\\MySQL\\MySQL Server 8.0\\my.ini" --init-file=C:\\mysql-init.txt
* サービスからサービス再起動
* mysql -u root -p
  * パスワードを入力上なら「root」
* package.jsonに下記追加しておくと楽かも
  * "connect": "mysql --user=root --password=root"

### mysqlのコマンド

* データベース作成：CREATE DATABASE db_name
* データベース変更：use db_name
* データベース一覧：show databases;
* テーブル作成：普通のクリエイト文だが、ddlにして下記でもいい
  * source xxx/xxx.ddl
* テーブル一覧：show tables;
* カラム一覧：show columns from xxx;

## typescript & mysql → prisma

* npm i prisma --save-dev
* npx prisma init
* [schema.prisma]修正
* npx prisma migrate dev --name init

* [app.ts]参照して
* [Prisma] チートシート
*  https://qiita.com/koffee0522/items/92be1826f1a150bfe62e
