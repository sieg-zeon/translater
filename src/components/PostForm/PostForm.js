import React, { useEffect, useState, useContext } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { FormControl, TextField, Button } from '@material-ui/core'
import { createPost } from '../../graphql/mutations'
import { listPosts } from '../../graphql/queries'
import { onCreatePost } from '../../graphql/subscriptions'
import { UserContext } from '../../Context/UserContext'


const initialState = {
    content: '',
    description: '',
    userId: '',
}
const PostForm = () => {
    const userAttributes = useContext(UserContext)
    const [formState, setFormState] = useState(initialState)
    const [posts, setPosts] = useState([])

    // useEffect(() => {
    //     // console.log("a")
    //     fetchPosts()
    //     const subscription = API.graphql(graphqlOperation(onCreatePost)).subscribe({
    //         next: (eventData) => {
    //             const newPost = eventData.value.data.onCreatePost
    //             const Posts = [...posts.filter(r => {
    //                 return (r.content !== newPost.content)
    //                 }), newPost]
    //             setPosts(...posts, Posts)
    //             }
    //     })
    //     return () => subscription.unsubscribe()
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [posts])

    // async function fetchPosts() {
    //     try {
    //         const PostData = await API.graphql(graphqlOperation(listPosts))
    //         const Posts = PostData.data.listPosts.items
    //         setPosts(Posts)
    //     } catch (err) {
    //         console.log('error fetching posts')
    //     }
    // }
    function setInput(key, value) {
        setFormState({ ...formState, [key]: value })
    }
    async function addPost() {
        try {
            if (!formState.content || !formState.description) return
            const userId = userAttributes.userAttributes.sub
            const post = {
                ...formState,
                userId: userId
            }
            setPosts([...posts, post])
            setFormState(initialState)
            await API.graphql(graphqlOperation(createPost, {input: post}))
        } catch (err) {
            console.log('error creating post:', err)
        }
    }
    return (
        <>
            <FormControl>
                <TextField
                    onChange={event => setInput('content', event.target.value)}
                    variant="outlined"
                    label="英文投稿フォーム"
                    multiline
                    rows={4}
                    rowsMax={6}
                    value={formState.content}
                />
                <TextField
                    onChange={event => setInput('description', event.target.value)}
                    variant="outlined"
                    label="備考フォーム"
                    multiline
                    rows={2}
                    rowsMax={4}
                    value={formState.description}
                />
                <Button onClick={addPost} variant="contained" color="primary">
                    Post
                </Button>
            </FormControl>
            {
            posts.map((post, index) => (
                <div key={post.id ? post.id : index}>
                    <p>content: {post.content}</p>
                    <p>description: {post.description}</p>
                    <hr/>
                </div>
                ))
            }
        </>
    )
}

export default PostForm