
import Blog from "./Blog";

const BlogList = ({blogs, user, handleLikes}) => {
    return (
        <div>
            <h2>blogs</h2>
            {blogs.filter(blog => blog.user && blog.user.username === user.username)
                .map(blog =>
                    <Blog key={blog.id} blog={blog} handleLikes={handleLikes} />
                )}
        </div>
    )
}


export default BlogList