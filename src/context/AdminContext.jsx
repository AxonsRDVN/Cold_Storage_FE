import { useState, createContext } from 'react';

const AdminContext = createContext()

const AdminProvider = ({ children }) => {
    const [openPopupAddFactory, setOpenPopupAddFactory] = useState(false)
    const [openPopupAddStorage, setOpenPopupAddStorage] = useState(false)
    const [openPopupAddLocation, setOpenPopupAddLocation] = useState(false)
    const [openPopupConfigFactory, setOpenPopupConfigFactory] = useState(false)
    const [openPopupConfigStorage, setOpenPopupConfigStorage] = useState(false)
    const [openPopupConfigLocation, setOpenPopupConfigLocation] = useState(false)
    const [openPopupDelete, setOpenPopupDelete] = useState(false)
    const [refreshDataTable, setRefreshDataTable] = useState(false)

    const [configPlant, setConfigPlant] = useState({})
    const [addStorage, setAddStorage] = useState({})
    const [configStorage, setConfigStorage] = useState({})
    const [addLocation, setAddLocation] = useState({})
    const [configLocation, setConfigLocation] = useState({})

    const [deleteType, setDeleteType] = useState('')
    const [deleteObject, setDeleteObject] = useState({})

    const value = {
        openPopupAddFactory, setOpenPopupAddFactory,
        openPopupAddStorage, setOpenPopupAddStorage,
        openPopupAddLocation, setOpenPopupAddLocation,
        openPopupConfigFactory, setOpenPopupConfigFactory,
        openPopupConfigStorage, setOpenPopupConfigStorage,
        openPopupConfigLocation, setOpenPopupConfigLocation,
        openPopupDelete, setOpenPopupDelete,
        refreshDataTable, setRefreshDataTable,
        configPlant, setConfigPlant,
        addStorage, setAddStorage,
        configStorage, setConfigStorage,
        addLocation, setAddLocation,
        configLocation, setConfigLocation,
        deleteType, setDeleteType,
        deleteObject, setDeleteObject
    }
    
    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    )
}

export { AdminContext, AdminProvider }