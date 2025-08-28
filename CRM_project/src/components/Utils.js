import axios from 'axios';
import { RoleEnum } from '@/components/Enums.vue';

export async function getMe(){
    const response = await axios.get('/api/user/me')
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
    const response = await axios.get('/api/refresh')
    localStorage.removeItem('jwtToken')

    const token = response.data.jwt;
    localStorage.setItem('jwtToken', token);
}

export async function getDepartments(id = null){
    let url = '/api/user/department'
    if (id)
        url = `${url}?id=${id}`

    return (await axios.get(url)).data
}

export async function getTasks(limit = null, is_archive = false, params = {}) {
    let url = '/api/user/task'
    let query = { ...params, is_archive }
    if (limit != null){
        query.limit = limit
    }
    let tasks = (await axios.get(url, { params: query })).data.data
    return tasks
}

export async function getEvents(limit = null, params = {}){
    let url = '/api/user/event'
    try{
        let response
        if(limit != null){
            response = (await axios.get(`${url}?limit=${limit}`))
        }
        else {
            response = await axios.get(url, { params })
        }
        return response
    } catch (error) {
        console.error('Ошибка создания евента:', error);
        return []; // Возвращаем пустой массив в случае ошибки
    }
}

export async function getSupervisors(){
    try{
        const user = await axios.get('/api/user/me')
        console.log(user.data.profile.departments)

        return user
    } catch (error) {
        console.error('Ошибка загрузки информации о вас:', error);
        return []; // Возвращаем пустой массив в случае ошибки
    }
}

export function getToday() {
    return new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export async function sendFile(files, title = null) {
    const fd = new FormData()

    if (title)
        fd.append('title', title)

    if (Array.isArray(files))
        files.forEach(file => fd.append('body', file))
    else
        fd.append('body', files)

    await axios.post('/api/user/file/upload', fd, {headers: {'Content-Type': 'multipart/form-data'}})
}

export async function downloadFile(url, id){
    const response = await axios.get(`${url}/${id}`, {responseType: 'blob'});
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
        }
    }
    return TableSchema[name] || null;
}