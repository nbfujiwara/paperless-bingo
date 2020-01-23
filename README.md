# Quick Start

```common/.env.local.sample```　をコピーし、Firebase情報を記入して　```common/.env.local```　として保存
```
$ yarn install
```
```
$ cd app_player
$ yarn dev
```
http://localhost:3000
にアクセス(プレイヤー側)
```
$ cd app_admin
$ yarn dev
```
http://localhost:3001
にアクセス（管理側）

# 管理ユーザ追加
1. http://localhost:3001 で管理側にアクセスし、OAuth認証する
1. Firebaseコンソールにログインし「Database」にいく
1. adminUsersに追加されていると思うので、同一ドキュメントIDでadminUserRolesにドキュメントを追加する
1. その際にフィールドはrole:1を入れる

# Deploy
```
$ firebase login
$ yarn deploy
```
