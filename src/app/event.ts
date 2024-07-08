export interface Event {
    id?: string,
    name: string,
    description?: string,
    category: string,
    allday: boolean,
    start?: Date;
    end?: Date;
    repeat: {
        mon : boolean,
        tue : boolean,
        wed : boolean,
        thu : boolean,
        fri : boolean,
        sat : boolean, 
        sun : boolean
    },
    username: string
}
