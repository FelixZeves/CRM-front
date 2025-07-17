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