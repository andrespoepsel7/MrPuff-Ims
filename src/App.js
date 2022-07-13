// Para hacer nesting de las rutas en la aplicación
import {Route, Routes} from 'react-router-dom'
import {UserAuthContextProvider} from './context/UserAuthContext'
// Páginas
import Login from './screens/Login';
import ProtectedRoute from './screens/ProtectedRoute';
// Rutas dinámicas
import HomeInfo from './screens/HomeInfo';
import HomeInventory from './screens/HomeInventory';
import HomePedidos from './screens/HomePedidos';
import HomeEntregas from './screens/HomeEntregas';
import HomeSucursales from './screens/HomeSucursales';
import HomeCrearSucursal from './screens/HomeCrearSucursal';
import HomeVentas from './screens/HomeVentas';
import HomeProductos from './screens/HomeProductos';
import HomeCrearProducto from './screens/HomeCrearProducto';
import HomeEditProduct from './screens/HomeEditProduct';
import HomeCrearPedido from './screens/HomeCrearPedido';
import HomeVerPedido from './screens/HomeVerPedido';
import HomeVerDetallesInventario from './screens/HomeVerDetallesInventario';
import HomeEntregasAdmin from './screens/HomeEntregasAdmin';


function App() {

  return (
    <UserAuthContextProvider>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/home' element={<ProtectedRoute><HomeInfo/></ProtectedRoute>}/>
        <Route path='/inventario' element={<ProtectedRoute><HomeInventory/></ProtectedRoute>}/>
        <Route path='/pedidos' element={<ProtectedRoute><HomePedidos/></ProtectedRoute>}/>
        <Route path='/entregas' element={<ProtectedRoute><HomeEntregas/></ProtectedRoute>}/>
        <Route path='/entregas-admin' element={<ProtectedRoute><HomeEntregasAdmin/></ProtectedRoute>}/>
        <Route path='/sucursales' element={<ProtectedRoute><HomeSucursales/></ProtectedRoute>}/>
        <Route path='/crear-sucursal' element={<ProtectedRoute><HomeCrearSucursal/></ProtectedRoute>}/>
        <Route path='/ventas' element={<ProtectedRoute><HomeVentas/></ProtectedRoute>}/>
        <Route path='/productos' element={<ProtectedRoute><HomeProductos/></ProtectedRoute>}/>
        <Route path='/crear-producto' element={<ProtectedRoute><HomeCrearProducto/></ProtectedRoute>}/>
        <Route path='/editar-producto/:id' element={<ProtectedRoute><HomeEditProduct/></ProtectedRoute>}/>
        <Route path='/crear-pedido' element={<ProtectedRoute><HomeCrearPedido/></ProtectedRoute>}/>
        <Route path='/ver-pedido/:id' element={<ProtectedRoute><HomeVerPedido/></ProtectedRoute>}/>
        <Route path='/ver-detalles-inventario/:id' element={<ProtectedRoute><HomeVerDetallesInventario/></ProtectedRoute>}/>
      </Routes>
    </UserAuthContextProvider>
    
  );
}

export default App;
