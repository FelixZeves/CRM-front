import api from '@/main';
import { RoleEnum } from '@/components/Enums.vue';

export const USER = '/user'
export const TASK = `/task`
export const DEPARTMENT = `/department`
export const EVENT = `/event`
export const COLLECTION = `/collection`
export const FILE = `/document`
export const CLASS = `/class`
export const LESSON = `/lesson`

export async function getMe(){
    const response = await api.get(`${USER}/me`)
    return response
}

export function scheduleTokenRefresh() {
    try {
        const token = localStorage.getItem('jwtToken')
        const payload = JSON.parse(atob(token.split('.')[1]))
        const exp = payload.exp * 1000
        const ttl = exp - Date.now()
        if (ttl > 60000) { 
            console.log(`Токен обновится через ${Math.round((ttl - 60000)/1000)} сек`)
            setTimeout(refreshToken, ttl - 60000)
        } else {
            refreshToken()
            console.log('Токен обновлён')
        }
    } catch (e) {
        console.error('Ошибка при разборе JWT:', e)
        refreshToken()
    }
}

export async function refreshToken(){
    const response = await api.get('/refresh')
    localStorage.removeItem('jwtToken')

    const token = response.data.jwt;
    localStorage.setItem('jwtToken', token);
}

export async function getDepartments(id = null){
    let url = DEPARTMENT
    if (id)
        url = `${url}?id=${id}`

    return (await api.get(url)).data
}

export async function getTasks(limit = null, is_archive = false, params = {}) {
    let query = { ...params, is_archive }
    if (limit != null){
        query.limit = limit
    }
    let tasks = []
    if (params.id)
        tasks = [(await api.get(`${TASK}/${params.id}`)).data.data]
    else
        tasks = (await api.get(`${TASK}`, { params: query })).data.data
    return tasks
}

export async function getEvents(limit = null, params = {}){
    try{
        let response
        if(limit != null){
            response = (await api.get(`${EVENT}?limit=${limit}`))
        }
        else {
            response = await api.get(EVENT, { params })
        }
        return response
    } catch (error) {
        console.error('Ошибка создания евента:', error);
        return []; // Возвращаем пустой массив в случае ошибки
    }
}

export async function getSupervisors(){
    try{
        const user = await api.get(`${USER}/me`)
        return user
    } catch (error) {
        console.error('Ошибка загрузки информации о вас:', error);
        return []; // Возвращаем пустой массив в случае ошибки
    }
}

export function getToday() {
    return new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export async function downloadFile(url, id){
    const response = await api.get(`${url}/download/${id}`, {responseType: 'blob'});
    const disposition = response.headers['content-disposition'] || '';
    const fileNameMatch = disposition.match(/filename="?([^"]+)"?/);
    const fileName = fileNameMatch ? decodeURIComponent(fileNameMatch[1]) : 'file.bin';

    const tmpUrl = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = tmpUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(tmpUrl);
}

export function getFormSchema(name) {
    const formSchemas = {
        user: {
            email: '',
            default_pass: true,
            role: 3,
            profile: {
                fio: '',
                post: '',
                classes: null,
                department: null,
                lessons: null,
            }},
        class: {
            number: '',
            parallel: '',
            specialization: null
        },
        lesson: {
            title: ''
        },
        department: {
            title: '',
            parents: [],
            manager: null,
            childrens: [],
            staff: []
        },
        event: {
            title: '',
            description: '',
            place: '',
            user: [],
            at: getToday(),
            to: getToday()
        },
        file: {
            title: '',
            body: [],
            permanent: false,
            type: null,
            focus: null,
            departments: []
        },
        collection: {
            title: '',
            subs: [],
            pubs: []
        }
    };

    return formSchemas[name] ? JSON.parse(JSON.stringify(formSchemas[name])) : {};
}

export function getTableSchema(name) {
    const TableSchema = {
        user: {
            label: "Пользователи",
            columns: [
                { name: 'fio', label: 'Ф.И.О.', field: row => row.profile.initials_name, align: 'left', sortable: true },
                { name: 'post', label: 'Должность', field: row => row.profile.post, align: 'left', sortable: true },
                { name: 'email', label: 'E-mail', field: row => row.email, align: 'left', sortable: true },
                { name: 'role', label: 'Уровень доступа', field: row => RoleEnum[row.role].translation, align: 'right', sortable: true },
                { name: 'default_pass', label: 'Стандартный пароль', field: row => row.default_pass ? '✔' : '✖', align: 'center', sortable: true },
                { name: 'update_at', label: 'Обновлено', field: row => row.profile.update_at, align: 'center', sortable: true }]
        },
        department: {
            label: "Отделы",
            columns: [
                { name: 'title', label: 'Отдел', field: row => row.title, align: 'left', sortable: true },
                { name: 'manager', label: 'Руководитель отдела', field: row => row.manager?.init_name, align: 'left', sortable: true },
                { name: 'parents', label: 'Вышестоящее руководство', field: row => row.parents.map(item => `${item.title} `), align: 'left', sortable: true },
                { name: 'childrens', label: 'Дочерние отделы', field: row => row.childrens.length, align: 'left', sortable: true},
                { name: 'staff', label: 'Сотрудники', field: row => `${row.staff.length} чел.`, align: 'center', sortable: true },
                { name: 'update_at', label: 'Обновлено', field: row => row.update_at, align: 'left', sortable: true }]
        },
        classes: {
            label: "Классы",
            columns: [
                { name: 'class', label: 'Класс', field: row => `${row.number}.${row.parallel}`, align: 'left', sortable: true },
                { name: 'spec', label: 'Уклон', field: row => row.spec?.title || '', align: 'left', sortable: true },
                { name: 'update_at', label: 'Обновлено', field: row => row.update_at, align: 'left', sortable: true },]
        },
        lessons: {
            label: "Уроки",
            columns: [
                { name: 'title', label: 'Урок', field: row => row.title, align: 'left', sortable: true },
                { name: 'update_at', label: 'Обновлено', field: row => row.update_at, align: 'left', sortable: true },]
        },
        collections: {
            label: "Группы",
            columns: [
                { name: 'title', label: 'Группа', field: row => row.title, align: 'left', sortable: true },
                { name: 'subscribers', label: 'Участники', field: row => row.subs.length, align: 'left', sortable: true },
                { name: 'publishers', label: 'Писатели', field: row => row.pubs.length,  align: 'left', sortable: true },
                { name: 'update_at', label: 'Обновлено', field: row => row.update_at, align: 'left', sortable: true },]
        },
        students: {
            label: "Ученики",
            columns: [
                { name: 'fio', label: 'Ф.И.О.', field: row => row.name, align: 'left', sortable: true },
                { name: 'parents', label: 'Родители', field: row => row.parents, align: 'left', sortable: true },
                { name: 'mainPhone', label: 'Основной телефон', field: row => row.mainPhone, align: 'left', sortable: true },
                { name: 'subPhone', label: 'Доп. телефон', field: row => row.subPhone, align: 'left', sortable: true },
                { name: 'health', label: 'Группа здоровья', field: row => row.health, align: 'left', sortable: true },
                { name: 'tutors', label: 'Репетиторы', field: row => row.tutors.map(item => `${item.title} `), align: 'left', sortable: true },
                { name: 'achievementsRus', label: 'Информация об участии во Всероссийских конкурсах детского творчества', field: row => row.achievementsRus, align: 'left', sortable: true },
                { name: 'achievementsInter', label: 'Информация об участии детей в Международных конкурсах детского творчества', field: row => row.achievementsInter, align: 'left', sortable: true },
                { name: 'schoolEvents', label: 'Участие в мероприятиях школы', field: row => row.schoolEvents, align: 'left', sortable: true },
                { name: 'specAttention', label: 'Требует особого внимания', field: row => row.specAttention, align: 'left', sortable: true },
            ]
        },
    }
    return TableSchema[name] || null;
}