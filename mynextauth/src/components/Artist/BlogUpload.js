import React from 'react'

const BlogUpload = () => {
  return (
    <div>
        {/* Blog Upload Section */}
        <div className="blog-upload-section">
                <h3>Upload a Blog</h3>
                <p>Share your thoughts, artistic journey, and more through blogs.</p>
                <button className="btn-upload" onClick={() => setSelectedSection('uploadBlog')}>
                    Go to Upload Blog
                </button>
                {selectedSection === 'uploadBlog' && <BlogUpload />}
            </div>

            {/* Display Artist's Blogs */}
            <div className="artist-blogs">
                <h3>Your Blogs</h3>
                {blogs.length > 0 ? (
                    <ul>
                        {blogs.map((blog, index) => (
                            <li key={index}>
                                <h4>{blog.title}</h4>
                                <p>{blog.excerpt}</p>
                                <button
                                    onClick={() => window.location.href = `/blog/${blog.id}`}
                                >
                                    Read Full Blog
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No blogs available yet. Start by uploading a blog!</p>
                )}
            </div>
    </div>
  )
}

export default BlogUpload
