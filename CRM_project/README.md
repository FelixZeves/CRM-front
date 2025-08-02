# CRM_project

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Установка проекта (Project Setup)

```sh
npm install
```

### Компиляция и быстрая перезагрузка для разработки (Compile and Hot-Reload for Development)

```sh
npm run dev
```

### Компиляция и минификация для продукт версии (Compile and Minify for Production)

```sh
npm run build
```


### Описание директорий:
### 1)CRM_project/src/pages - папка с отображаемыми страницами;
### 2)CRM_project/src/components - папка с компонентами для основных страниц;
#### 2.1) ./components/cards - компоненты на основе q-card, единичные экземпляры мероприятий, задач и документов;
#### 2.2) ./components/forms - компоненты с формами взаимодействия с БД, работа с задачами, мероприятиями и документами, формы добавления записей в админ. панели;
#### 2.3) ./components/layouts - компоненты с вспомагательной разметкой;
#### 2.4) ./components/menus - компоненты с навигацией по страницам (сайту) и с фильтрацие данных страницы;
#### 2.5) ./components/CRMCalendar - компонент для отображения календаря с мероприятиями;
#### 2.6) ./components/Enums - файл с константнуми данными;
#### 2.7) ./components/Notifies - файл с настройками всплывающих сообщений;
#### 2.8) ./components/Utils - файл с переиспользуемыми функциями;
### 3)CRM_project/src/assets - папка с дополнительными шрифтами, стилями и используемыми изображениями;