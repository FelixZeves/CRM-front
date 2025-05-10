<script>
export const RoleEnum = Object.freeze({
    0: {name: 'Admin', translation: 'Администратор' },
    1: {name: 'Leader', translation: 'Руководитель' },
    2: {name: 'Staff', translation: 'Административный работник' },
    3: {name: 'Teacher', translation: 'Учитель' },
})

export const TypesEnum=Object.freeze({
    'execute': {translation: "Ожидает выполнения"},
    'agree': {translation: "Ожидает согласования"},
    'accept': {translation: "Ожидает проверки"},
    'completed': {translation: "Выполнено"},
})

export const StatusEnum=Object.freeze({
    'danger': {description: "Задача ожидает выполнения", color: "!bg-[--crm-c-danger]", textColor: "text-white"},
    'wait': {description: "Задача на согласовании и проверке", color: "!bg-[--crm-c-light-yellow]", textColor: "text-black"},
    'complete': {description: "Задача выполенена", color: "!bg-[--crm-c-complete]", textColor: "text-white"},
})

export const TableEnum=Object.freeze({
    'users': {  title: "Пользователи",
                name: 'users',
                icon: 'fa-solid fa-user',
                cols: [
                    {name: 'full name', label: 'ФИО', field: 'full name', align: 'center'},
                    {name: 'email', label: 'email', field: 'email', align: 'center'},
                    {name: 'role', label: 'Роль', field: 'role', align: 'center'},
                    {name: 'post', label: 'Должность', field: 'post', align: 'center'},
                    {name: 'departments', label: 'Отделы', field: 'departments', align: 'center'},
                ],
                getUrl: '/api/user',
                dataMapper: (val) => ({
                    email: val.email,
                    'full name': val.profile.fio,
                    role: val.role,
                    id: val.id,
                    post: val.profile.post,
                    departments: val.departments,

                })
    },
    'departments':{
                title: 'Отделы',
                name: 'departments',
                icon: 'fa-solid fa-people-group',
                cols: [
                    {name: 'title', label: 'Название', field: 'title', align: 'center'},
                    {name: 'head_department', label: 'Управляющий отдел', field: 'head_department', align: 'center'},
                    {name: 'supervisors', label: 'Руководители', field: 'supervisors', align: 'center'}],
                getUrl: '/api/user/department',
                dataMapper: (val) => ({
                    title: val.title,
                    'head_department': val.head_department,
                    supervisors: val.supervisors,
                    id: val.id
                })
    },
    'classes':{
                title: 'Классы',
                name: 'classes',
                icon: 'class',
                cols: [
                    {name: 'number', label: 'Номер', field: 'number', align: 'center'},
                    {name: 'parallel', label: 'Параллель', field: 'parallel', align: 'center'},
                    {name: 'spec', label: 'Специализация', field: 'spec', align: 'center'},
                ],
                getUrl: '/api/user/class',
                dataMapper: (val) => ({
                    number: val.number,
                    parallel: val.parallel,
                    spec: val.spec,
                    id: val.id
                })
    },
    'lessons':{
                title: 'Учебные предметы',
                name: 'lessons',
                icon: 'menu_book',
                cols: [{name: 'title', label: 'Название', field: 'title', align: 'center'},
                ],
                getUrl: '/api/user/lesson',
                dataMapper: (val) => ({
                    title: val.title,
                    id: val.id
                })
    }
})

export const ModalEnum=Object.freeze({
    'users': {
        title: 'Пользователи',
        values:  [
        {name: "E-mail",
            model: "email",
            rules:
                [val => !!val || 'Обязательное поле',
                val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Введите корректный email']},

        {name: "Пароль",
            model: "password",
            hint: 'Может генерироваться автоматически',},

        {name: "ФИО",
            model: "fio",
            rules:
                [val => !!val || 'Обязательное поле']},

        {name: "Роль",
            model: "role",
            hint: 'По умолчанию - "Учитель"',
            options:
                [{value: 0,  label: 'Админ'},
                {value: 1,  label: 'Руководитель'},
                {value: 2,  label: 'Административный работник'},
                {value: 3,  label: 'Учитель'}]},

        {name: "Подразделение",
            hint: 'Необязательное поле',
            model: "department"},

        {name: "Классы",
            hint: 'Необязательное поле',
            model: "classes"},

        {name: "Уроки",
            hint: 'Необязательное поле',
            model: "lessons"},
        ],
        params: {
            email: '',
            fio: '',
            password: null,
            role: 3,
            department: '',
            classes: null,
            lessons: null
        }
    },
})

</script>