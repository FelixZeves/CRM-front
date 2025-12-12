import api from '@/main';
import { houseConditions, RoleEnum } from '@/components/Enums.vue';

export const USER = '/user'
export const TASK = `/task`
export const DEPARTMENT = `/department`
export const EVENT = `/event`
export const COLLECTION = `/collection`
export const FILE = `/document`
export const CLASS = `/class`
export const LESSON = `/lesson`
export const STUDENT = `/student`

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
    try{

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
    } catch(error){
        console.error('Ошибка получения задач:', error)
        return []
    }
}

export async function getClasses(){
    try{
        let classes = (await api.get(`${CLASS}`)).data.data
        return classes
    } catch(error){
        console.error('Ошибка получения классов:', error)
        return []
    }
}

export async function getStudents(limit = null, params = {}){
    try{
        let query = { ...params}
        if (limit != null){
            query.limit = limit
        }
        let students = []
        if (params.id)
            students = [(await api.get(`${STUDENT}/${params.id}`)).data.data]
        else
            students = (await api.get(`${STUDENT}`)).data.data
    
        return students
    } catch (error) {
        console.error('Ошибка получения учеников:', error)
        return []
    }
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

export function formatPhone(phone) {
    if (!phone) return ''
  
    // если мобильный (11 цифр, начинается с 7 или 8)
    if (/^(\+7|7|8)\d{10}$/.test(phone)) {
      return phone.replace(/(\d)(\d{3})(\d{3})(\d{2})(\d{2})/, '8($2)$3-$4-$5')
    }
  
    // если домашний (например, 6 цифр)
    if (/^\d{5}$/.test(phone)) {
      return phone.replace(/(\d{1})(\d{2})(\d{2})/, '$1-$2-$3')
    }
  
    return phone // fallback
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
                phone: null,
                classes: [],
                department: null,
                lessons: null,
            }},
        class: {
            number: '',
            parallel: '',
            spec: null,
            lid: null
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
        },
        parent: {
            fio: '',
            phone: '',
            work: '',
            post: '',
            education: '',
            kinship: null,
            curator: false,
            status: '',
        },
        student: {
            id: null,
            fio: '',
            birthday: '',
            country_reg: false,
            gender: 'm',
            address_type: '',
            address_reg: '',
            address_living: '',
            parents: [],
            family_type: [],
            phone: '',
            home_education: false,
            health: 1,
            achievementsRus: [],
            achievementsInter: [],
            schoolEvents: [],
            sp_doctor: null,
            sp_disease: null,
            count_family: null,
            count_childs: null,
            odn_date: null,
            sop_date: null,
            gr_reason: null,
            df_reason: null,
            dls_reason: null,
            comment: null
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
                { name: 'class', label: 'Класс', field: row => `${row.parallel}.${row.number}`, align: 'left', sortable: true },
                { name: 'spec', label: 'Уклон', field: row => row.spec || '', align: 'left', sortable: true },
                { name: 'update_at', label: 'Обновлено', field: row => row.update_at, align: 'left', sortable: true },
                { name: 'leader', label: 'Классный руководитель', field: row => row.leader?.fio, align: 'left', sortable: true}]
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
                { name: 'fio', label: 'Ф.И.О.', field: row => row.fio, align: 'left', sortable: true },
                { name: 'phone', label: 'Телефон', field: row => formatPhone(row.phone), align: 'left', sortable: true },
                { name: 'gender', label: 'Пол', field: row => row.gender == 'm'?  'М' : 'Ж', align: 'center', sortable: true },
                { name: 'birthday', label: 'Дата рождения', field: row => row.birthday, align: 'center', sortable: true},
                { name: 'age', label: 'Возраст', field: row => row.age, align: 'center', sortable: true},
                { name: 'health', label: 'Группа здоровья', field: row => row.health, align: 'center', sortable: true },
                { name: 'specAttention', label: 'Требует особого внимания', field: row => row.sp_disease != null ? '✔' : '✖', align: 'center', sortable: true },
                { name: 'homeEducation', label: 'Домашнее обучение', field: row => row.home_education ? '✔' : '✖', align: 'center', sortable: true},
                { name: 'citizenship', label: 'Гражданство РФ', field: row => row.country_reg ? '✔' : '✖', align: 'center', sortable: true},
                { name: 'housingConditions', label: 'Жилищные условия', field: row => row.address_type, align: 'left', sortable: true},
                { name: 'regAddress', label: 'Адрес проживания', field: row => row.address_reg, align: 'left', sortable: true},
                { name: 'resAddress', label: 'Адрес прописки', field: row => row.address_living, align: 'left', sortable: true},
                { name: 'parents', label: 'Родители', field: row => row.parents, align: 'left', sortable: true },
                { name: 'family_type', label: 'Категории семьи', field: row => row.family_type, align: 'left', sortable: true},
                { name: 'veterans', label: 'Родители - участники боевых действий', field: row => row.parents?.some(p => p.status) ? '✔' : '✖', align: 'center', sortable: true},
                { name: 'schoolEvents', label: 'Школьные конкурсы', field: row => row.schoolEvents, align: 'left', sortable: true },
                { name: 'achievementsRus', label: 'Всероссийские конкурсы', field: row => row.achievementsRus, align: 'left', sortable: true },
                { name: 'achievementsInter', label: 'Международные конкурсы', field: row => row.achievementsInter, align: 'left', sortable: true },
            ]
        },
        teachers: {
            label: 'Учителя',
            columns: [
                { name: 'full_name', label: 'Ф.И.О', field: row =>  row.leader?.fio || 'Не назначен', align: 'left', sortable: true },
                { name: 'class', label: 'Класс', field: row => `${row.parallel}.${row.number} ${row.spec ||  ''}`, align: 'left', sortable: true },
                { name: 'phone',  label: 'Телефон',  field: row => row.leader?.phone  || 'Не указан', align: 'left', sortable: true },
                { name: 'email', label: 'E-mail', field: row => row.leader?.email, align: 'left', sortable: true },
            ]
        }
    }
    return TableSchema[name] || null;
}