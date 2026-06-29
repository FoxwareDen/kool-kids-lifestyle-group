import { Link } from "@tanstack/react-router"

function BlogRenderer() {
  return (
    <div>
      <Link to="/events">Events</Link>
      <Link to="/blogs">Blogs</Link>
    </div>
  )
}

export default BlogRenderer