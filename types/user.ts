type Subscription = {
    maxAudioHours: number,
    maxConversationTokens: number,
    maxPodcasts: number,
    name: string,
    id: string,
    createdAt: Date,
    updatedAt: Date,
    __entity: string
}

type Status = {
    id: number,
    name: string,
    __entity: string
}

type Role = {
    id: number,
    name: string,
    __entity: string
}
//Role,Status,Subscription ları ana roota eklemek istemediğimiz için bu şekilde tanımladık
/*type User = {
    id: number,
    subscription: Subscription,
    status: Status,
    role: Role,
    email: string,
    provider: string,
    socialId: string,
    firstName: string,
    lastName: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
}
export  {User, Subscription, Status, Role}; */