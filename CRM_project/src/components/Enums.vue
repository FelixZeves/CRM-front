<script>

export const RoleEnum = Object.freeze({
    0: {name: 'Admin', translation: 'Администратор' },
    1: {name: 'Leader', translation: 'Руководитель' },
    2: {name: 'Staff', translation: 'Административный работник' },
    3: {name: 'Teacher', translation: 'Учитель' },
})

export const RoleEnum_ = Object.freeze({
    ADMIN: 0,
    LEADER: 1,
    STAFF: 2,
    TEACHER: 3
})

export const TypesEnum=Object.freeze({
    'execute': {translation: "Ожидает выполнения"},
    'agree': {translation: "Ожидает согласования"},
    'accept': {translation: "Ожидает проверки"},
    'completed': {translation: "Выполнено"},
})

export const StatusEnum=Object.freeze({
    0: {description: "Задача ожидает выполнения", color: "!bg-[--crm-c-light-yellow]", textColor: "text-black"},
    1: {description: "Задача отклонена", color: "!bg-[--crm-c-danger]", textColor: "text-white"},
    2: {description: "Задача выполенена", color: "!bg-[--crm-c-complete]", textColor: "text-white"}
})

export const TaskTypeEnum = Object.freeze({
    EXECUTOR: 0,
    REVIEWER: 1,
    CHECKER: 2,
    CREATOR: 3
})

export const TaskTypeEnum_ = Object.freeze({
    0: 'EXECUTOR',
    1: 'REVIEWER',
    2: 'CHEKER',
    3: 'CREATOR'
})

export const StatusEnum_ = Object.freeze({
    PROGRESS: 0,
    REJECTED: 1,
    APPROVED: 2
})

export const DocEnum=Object.freeze({
    ORDER: 0,
    APPLICATION: 1,
    MEMO: 2
})

export const PlaceEnum = Object.freeze({
    ASSEMBLY: {id: 1, title: 'Актовый зал (1 этаж)'},
    FORUM: {id: 2, title: 'Форум-зона (1 этаж)'},
    COWORKING: {id: 3, title: 'Коворкинг (1 этаж)'},
    ELEMENT_LIBRARY: {id: 4, title: 'Информационно-библиотечный центр (начальная школа)'},
    HIGH_LIBRARY: {id: 5, title: 'Информационно-библиотечный центр (старшая школа)'},
    CONFERENCE: {id: 6, title: 'Конференц-зал (каб. 1.10)'},
    SUPPORT_SERVICE: {id: 7, title: 'Служба соц.-педагог. и психолог. поддержки (каб. 1.45)'},
    SHOOTING_GALLERY: {id: 8, title: 'Тир (1 этаж)'},
    MUSEUM_OF_WEAPONS: {id: 9, title: 'Музей славы боевого оружия (3 этаж)'},
})

export const PlaceDirectorEnum = Object.freeze({
    FURNITURE_EQUIPMENT: {id: 1, title: 'Оснащение пространств мебелью'},
    TECHNICAL_EQUIPMENT: {id: 2, title: 'Техническое оснащение пространств'},
    PHOTOGRAPHING: {id: 3, title: 'Фотографирование мероприятия'},
    ORGANIZATION: {id: 4, title: 'Организация мероприятия'}
})

export const FileTypeEnum = Object.freeze({
    ORDER: {id: 'Приказы'},
    REGULATORY: {id: 'Нормативные документы'},
    ESTIMATES: {id: 'Сметы'},
    STATEMENTS: {id: 'Заявления'}
})

export const FileFocusEnum = Object.freeze({
    EDUCATION: {id: 'Образование'},
    REPORTING: {id: 'Отчётность'},
    FINANCE: {id: 'Финансы'},
    PERSONNEL: {id: 'Кадровая часть'},
    CONTRACTS: {id: 'Договоры'},
    MT_PART: {id: 'МТ часть'},
})

export const fileIconsEnum = Object.freeze({
    'pdf': 'fa-regular fa-file-pdf',
    'jpg': 'fa-regular fa-file-image',
    'png': 'fa-regular fa-file-image',
    'docx': 'fa-regular fa-file-word',
    'pptx': 'fa-regular fa-file-powerpoint',
    'xlsx': 'fa-regular fa-file-excel',
    'txt': 'fa-regular fa-file-lines',
    'zip': 'fa-regular fa-file-zipper'
})

</script>