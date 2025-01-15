import { RouterProvider } from 'react-router-dom'

// Config
import router from '@/config/router'

function App() {
    return <RouterProvider router={router} />
}

export default App