
import {Routes , Route} from "react-router"
import Layout from "./pages/Layout"
import AddBlog from "./pages/AddBlog"
import Blogs from "./pages/Blogs"
import Blog from "./pages/Blog"

function App() {
 
 
  return (
     <Routes> 
        <Route path="/" element={<Layout />}>
          <Route index path="/" element={ <AddBlog /> } />
          <Route   path="/add" element={  <AddBlog /> } />
          <Route  path="/blogs" element={  <Blogs /> } />
          <Route path="/blogs/:id" element={  <Blog /> }  />
        </Route>
        <Route path="*" element={<AddBlog />} />
     </Routes>
  )
}

export default App
