import { Link } from "@tanstack/react-router"

function BlogRenderer({ slug }:{slug: string}) {
  return (
    <div>
      <Link to="/events">Events</Link>
      <Link to="/blogs">Blogs</Link>
    </div>
  )
}

export default BlogRenderer