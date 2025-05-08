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
                cols: [
                    {name: 'full name', label: 'ФИО', field: 'full name', align: 'center'},
                    {name: 'email', label: 'email', field: 'email', align: 'center'},
                    {name: 'role', label: 'Роль', field: 'role', align: 'center'},],
                getUrl: '../get_users',
                dataMapper: (val) => ({
                    email: val.email,
                    'full name': val.profile.fio,
                    role: val.role,
                    id: val.id
                })
    }
})

</script>