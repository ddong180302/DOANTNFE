import { IBackendRes, ICompany, IAccount, IUser, IModelPaginate, IGetAccount, IJob, IResume, IPermission, IRole, ISubscribers, ISkill, IChat, IMessage, IListChat } from '@/types/backend';
import axios from 'config/axios-customize';

/**
 * 
Module Auth
 */
export const callRegister = (name: string, email: string, password: string, age: number, gender: string, address: string, phone: string) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/auth/register', { name, email, password, age, gender, address, phone })
}

export const callLogin = (username: string, password: string) => {
    return axios.post<IBackendRes<IAccount>>('/api/v1/auth/login', { username, password })
}

export const callConfirm = (_id: string, email: string, codeConfirm: string) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/auth/confirm', { _id, email, codeConfirm })
}

export const callResetPass = (_id: string, email: string, password: string) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/auth/reset', { _id, email, password })
}

export const callGetUserByEmail = (email: string) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/auth/by-email', { email })
}

export const callFetchAccount = () => {
    return axios.get<IBackendRes<IGetAccount>>('/api/v1/auth/account')
}

export const callRefreshToken = () => {
    return axios.get<IBackendRes<IAccount>>('/api/v1/auth/refresh')
}

export const callLogout = () => {
    return axios.post<IBackendRes<string>>('/api/v1/auth/logout')
}

/**
 * Upload single file
 */
export const callUploadSingleFile = (file: any, folderType: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileUpload', file);
    return axios<IBackendRes<{ fileName: string }>>({
        method: 'post',
        url: '/api/v1/files/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "folder_type": folderType
        },
    });
}




/**
 * 
Module Company
 */
export const callCreateCompany = (name: string, address: string, country: string, companyType: string, companySize: string, workingDays: string, overtimePolicy: string, ourkeyskills: string[], description: string, logo: string) => {
    return axios.post<IBackendRes<ICompany>>('/api/v1/companies', { name, address, country, companyType, companySize, workingDays, overtimePolicy, ourkeyskills, description, logo })
}

export const callCreateContact = (name: string, position: string, email: string, location: string, phone: string, nameCompany: string, websiteAddress: string) => {
    return axios.post('/api/v1/companies/contact', { name, position, email, location, phone, nameCompany, websiteAddress })
}

export const callGetCompanyByUser = () => {
    return axios.post<IBackendRes<ICompany>>('/api/v1/companies/by-user');
}

export const callUpdateCompany = (id: string, name: string, address: string, country: string, companyType: string, companySize: string, workingDays: string, overtimePolicy: string, ourkeyskills: string[], description: string, logo: string) => {
    return axios.patch<IBackendRes<ICompany>>(`/api/v1/companies/${id}`, { name, address, country, companyType, companySize, workingDays, overtimePolicy, ourkeyskills, description, logo })
}

export const callDeleteCompany = (id: string) => {
    return axios.delete<IBackendRes<ICompany>>(`/api/v1/companies/${id}`);
}

export const callFetchCompany = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ICompany>>>(`/api/v1/companies?${query}`);
}

export const callFetchCompanyById = (id: string) => {
    return axios.get<IBackendRes<ICompany>>(`/api/v1/companies/${id}`);
}

export const callCountCompany = () => {
    return axios.post(`/api/v1/companies/count`);
}

export const callCountCompanyWithDate = (startDate: string, endDate: string) => {
    return axios.post(`/api/v1/companies/countDate`, null, {
        params: {
            startDate: startDate,
            endDate: endDate,
        },
    });
}

/**
 * 
Module User
 */
export const callCreateUser = (user: IUser) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/users', { ...user })
}

export const callCreateUserHr = (user: IUser) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/users/hr', { ...user })
}

export const callUpdateUser = (user: IUser) => {
    return axios.patch<IBackendRes<IUser>>(`/api/v1/users`, { ...user })
}

export const callUpdateUserHr = (user: IUser) => {
    return axios.patch<IBackendRes<IUser>>(`/api/v1/users/hr`, { ...user })
}

export const callDeleteUser = (id: string) => {
    return axios.delete<IBackendRes<IUser>>(`/api/v1/users/${id}`);
}

export const callFetchIdUser = (id: string) => {
    return axios.get<IBackendRes<IUser>>(`/api/v1/users/userId/${id}`);
}

export const callFetchUser = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IUser>>>(`/api/v1/users?${query}`);
}

export const callGetInforByUser = () => {
    return axios.post<IBackendRes<IUser>>(`/api/v1/users/by-user`);
}

export const callUpdateInforByUser = (user: IUser) => {
    return axios.patch<IBackendRes<IUser>>(`/api/v1/users/by-user`, { ...user });
}

export const callCountUser = () => {
    return axios.post(`/api/v1/users/count`);
}


export const callgetUserAdmin = () => {
    return axios.post(`/api/v1/users/getUserAdmin`);
}


export const callCountUserWithDate = (startDate: string, endDate: string) => {
    return axios.post(`/api/v1/users/countDate`, null, {
        params: {
            startDate: startDate,
            endDate: endDate,
        },
    });
}



/**
 * 
Module Skill
 */
export const callCreateSkill = (name: string) => {
    return axios.post<IBackendRes<ISkill>>('/api/v1/skills', { name })
}

export const callUpdateSkill = (id: string, name: string) => {
    return axios.patch<IBackendRes<ISkill>>(`/api/v1/skills/${id}`, { name })
}

export const callDeleteSkill = (id: string) => {
    return axios.delete<IBackendRes<ISkill>>(`/api/v1/skills/${id}`);
}

export const callFetchSkill = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ISkill>>>(`/api/v1/skills?${query}`);
}

/**
 * 
Module Job
 */
export const callCreateJob = (job: IJob) => {
    return axios.post<IBackendRes<IJob>>('/api/v1/jobs', { ...job })
}

export const callUpdateJob = (job: IJob, id: string) => {
    return axios.patch<IBackendRes<IJob>>(`/api/v1/jobs/${id}`, { ...job })
}

export const callDeleteJob = (id: string) => {
    return axios.delete<IBackendRes<IJob>>(`/api/v1/jobs/${id}`);
}

export const callFetchJob = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IJob>>>(`/api/v1/jobs?${query}`);
}

export const callFetchJobByHr = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IJob>>>(`/api/v1/jobs/by-hr?${query}`);
}

export const callFetchJobById = (id: string) => {
    return axios.get<IBackendRes<IJob>>(`/api/v1/jobs/${id}`);
}

export const callFetchJobByIdCompany = (id: string) => {
    return axios.get<IBackendRes<IJob>>(`/api/v1/jobs/by-company-id/${id}`);
}


export const callCountJob = () => {
    return axios.post(`/api/v1/jobs/count`);
}

export const callCountJobByHr = () => {
    return axios.post(`/api/v1/jobs/count-by-hr`);
}

export const callCountJobWithDate = (startDate: string, endDate: string) => {
    return axios.post(`/api/v1/jobs/countDate`, null, {
        params: {
            startDate: startDate,
            endDate: endDate,
        },
    });
}

export const callCountJobByHrWithDate = (startDate: string, endDate: string) => {
    return axios.post(`/api/v1/jobs/countDate-by-hr`, null, {
        params: {
            startDate: startDate,
            endDate: endDate,
        },
    });
}


/**
 * 
Module Resume
 */
export const callCreateResume = (url: string, companyId: any, jobId: any) => {
    return axios.post<IBackendRes<IResume>>('/api/v1/resumes', { url, companyId, jobId })
}

export const callUpdateResumeStatus = (id: any, status: string) => {
    return axios.patch<IBackendRes<IResume>>(`/api/v1/resumes/${id}`, { status })
}

export const callDeleteResume = (id: string) => {
    return axios.delete<IBackendRes<IResume>>(`/api/v1/resumes/${id}`);
}

export const callFetchResume = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IResume>>>(`/api/v1/resumes?${query}`);
}

export const callFetchResumeByHr = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IResume>>>(`/api/v1/resumes/by-hr?${query}`);
}

export const callFetchResumeById = (id: string) => {
    return axios.get<IBackendRes<IResume>>(`/api/v1/resumes/${id}`);
}

export const callFetchResumeByUser = () => {
    return axios.post<IBackendRes<IResume[]>>(`/api/v1/resumes/by-user`);
}

export const callCountResume = () => {
    return axios.post(`/api/v1/resumes/count`);
}

export const callCountResumeWithDate = (startDate: string, endDate: string) => {
    return axios.post(`/api/v1/resumes/countDate`, null, {
        params: {
            startDate: startDate,
            endDate: endDate,
        },
    });
}

export const callCountResumeByhr = () => {
    return axios.post(`/api/v1/resumes/count-by-hr`);
}

export const callCountResumeByHrWithDate = (startDate: string, endDate: string) => {
    return axios.post(`/api/v1/resumes/countDate-by-hr`, null, {
        params: {
            startDate: startDate,
            endDate: endDate,
        },
    });
}

/**
 * 
Module Permission
 */
export const callCreatePermission = (permission: IPermission) => {
    return axios.post<IBackendRes<IPermission>>('/api/v1/permissions', { ...permission })
}

export const callUpdatePermission = (permission: IPermission, id: string) => {
    return axios.patch<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`, { ...permission })
}

export const callDeletePermission = (id: string) => {
    return axios.delete<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`);
}

export const callFetchPermission = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IPermission>>>(`/api/v1/permissions?${query}`);
}

export const callFetchPermissionById = (id: string) => {
    return axios.get<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`);
}

/**
 * 
Module Role
 */
export const callCreateRole = (role: IRole) => {
    return axios.post<IBackendRes<IRole>>('/api/v1/roles', { ...role })
}

export const callUpdateRole = (role: IRole, id: string) => {
    return axios.patch<IBackendRes<IRole>>(`/api/v1/roles/${id}`, { ...role })
}

export const callDeleteRole = (id: string) => {
    return axios.delete<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
}

export const callFetchRole = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IRole>>>(`/api/v1/roles?${query}`);
}

export const callFetchRoleById = (id: string) => {
    return axios.get<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
}

/**
 * 
Module Subscribers
 */
export const callCreateSubscriber = (subs: ISubscribers) => {
    return axios.post<IBackendRes<ISubscribers>>('/api/v1/subscribers', { ...subs })
}

export const callGetSubscriberSkills = () => {
    return axios.post<IBackendRes<ISubscribers>>('/api/v1/subscribers/skills')
}

export const callUpdateSubscriber = (subs: ISubscribers) => {
    return axios.patch<IBackendRes<ISubscribers>>(`/api/v1/subscribers`, { ...subs })
}

export const callDeleteSubscriber = (id: string) => {
    return axios.delete<IBackendRes<ISubscribers>>(`/api/v1/subscribers/${id}`);
}

export const callFetchSubscriber = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ISubscribers>>>(`/api/v1/subscribers?${query}`);
}

export const callFetchSubscriberById = (id: string) => {
    return axios.get<IBackendRes<ISubscribers>>(`/api/v1/subscribers/${id}`);
}



/**
 * 
Module Chats
 */
export const callCreateChat = (chat: IChat) => {
    return axios.post<IBackendRes<IChat>>('/api/v1/chats', { ...chat })
}

export const callFetchChatById = (userId: string) => {
    return axios.get<IBackendRes<IChat>>(`/api/v1/chats/${userId}`);
}

/**
 * 
Module Messages
 */
export const callCreateMessage = (message: IMessage) => {
    return axios.post<IBackendRes<IMessage>>('/api/v1/messages', { ...message })
}

export const callFetchMessageByChatId = (chatId: string) => {
    return axios.get<IBackendRes<IMessage>>(`/api/v1/messages/${chatId}`);
}

export const callMessByFirstSecondId = (firstId: string, secondId: string) => {
    return axios.get<IBackendRes<IMessage>>(`/api/v1/messages/${firstId}/${secondId}`);
}
