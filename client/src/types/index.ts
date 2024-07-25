export type Post = {
    comments: [
        {
            commentimg: string,
            id: string,
            postId: string,
            timeStamp: string,
            title: string,

        }

    ],
    id: string,
    likes: boolean,
    postimg: string,
    timeStamp: string,
    title: string,
    user: {
        id: string,
        email: string,
        userimg: string,
        username: string
        likedPost: string[]


    },
    likedBy: string[]
    userId: string
}


export type Comment = {
    id: string,
    title: string,
    commentimg: string,
    timeStamp: string,
    post: {
        id: string,
        likes: number,
        postimg: string,
        timeStamp: string,
        title: string,
        userId: string
    },
    user: {
        id: string,
        email: string,
        userimg: string,
        username: string
    }
}

export interface User {
    id: string,
    email: string,
    userimg: string
    likedPost: string[],
    password: string,
    username: string
}