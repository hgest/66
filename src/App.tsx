import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Docs from './pages/Docs'
import BlogPost from './pages/BlogPost'
import Developers from './pages/Developers'
import Strategies from './pages/Strategies'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/developers" element={<Developers />} />
        <Route path="/strategies" element={<Strategies />} />
      </Route>
    </Routes>
  )
}
