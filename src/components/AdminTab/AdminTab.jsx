import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Tooltip } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CircleIcon from '@mui/icons-material/Circle';
import { AdminContext } from '../../context/AdminContext.jsx';
import PopupAddNewFactory from './AddNewFactory/AddNewFactory.jsx';
import PopupAddNewStorage from './AddNewStorage/AddNewStorage.jsx';
import PopupAddNewLocation from './AddNewLocation/AddNewLocation.jsx';
import PopupConfigFactory from './ConfigFactory/ConfigFactory.jsx';
import PopupConfigStorage from './ConfigStorage/ConfigStorage.jsx';
import PopupConfigLocation from './ConfigLocation/ConfigLocation.jsx';
import PopupDelete from './DeletePopup/DeletePopup.jsx';
import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import API from '../../api/api.js';
import './AdminTab.scss';   

const RowStorage = React.memo((props) => {
    const { plant, storage } = props;
    const [open, setOpen] = useState(false);

    const context = useContext(AdminContext)
    const { t } = useTranslation('translation')

    const handleAddNewLocation = (plantInfor, storageInfor) => {
        context.setAddLocation({ plant: plantInfor, storage: storageInfor })
        context.setOpenPopupAddLocation(true)
    }

    const handleConfigStorage = (plantInfor, storageInfor) => {
        context.setConfigStorage({ plant: plantInfor, storage: storageInfor })
        context.setOpenPopupConfigStorage(true)
    }

    const handleConfigLocation = (plantInfor, storageInfor, locationInfor) => {
        context.setConfigLocation({ plant: plantInfor, storage: storageInfor, location: locationInfor })
        context.setOpenPopupConfigLocation(true)
    }

    const handleOpenPopupDelete = (type, plantInfor, storageInfor, locationInfor) => {       
        context.setDeleteType(type)
        context.setDeleteObject({ plant: plantInfor, storage: storageInfor, location: locationInfor })
        context.setOpenPopupDelete(true)
    }

    return (
        <React.Fragment>
            <TableRow key={storage.storageId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{backgroundColor: open ? '#ebebeb' : '#ffffff'}}>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell align='left' sx={{backgroundColor: open ? '#ebebeb' : '#ffffff'}} className='admintab-table-body-cell'>{storage.storageName}</TableCell>
                <TableCell align='left' sx={{backgroundColor: open ? '#ebebeb' : '#ffffff'}} className='admintab-table-body-cell'>{storage.effectiveDate}</TableCell>
                <TableCell align='center' sx={{backgroundColor: open ? '#ebebeb' : '#ffffff'}} className='admintab-table-body-cell'>{storage.activeDevices}</TableCell>
                <TableCell align='center' sx={{backgroundColor: open ? '#ebebeb' : '#ffffff'}} className='admintab-table-body-cell'>
                    <Stack direction='row' justifyContent='center'>
                        <div className='dashboard-common-table-cell-std'>{storage.standard.temp}&deg;C</div>
                        <div className='dashboard-common-table-cell-std'>{storage.standard.humi}%</div>
                    </Stack>
                </TableCell>
                <TableCell align='center' sx={{backgroundColor: open ? '#ebebeb' : '#ffffff'}}>
                    <Stack direction='row' justifyContent='flex-start'>
                        <CircleIcon sx={{width: '8px', color: storage.status === 'Active' ? '#61eb34' : '#c40502', marginRight: '10px'}}/>
                        <span className='admintab-table-body-cell'>{storage.status}</span>
                    </Stack>
                </TableCell>
                <TableCell align='center' sx={{backgroundColor: open ? '#ebebeb' : '#ffffff'}}>
                    <Stack direction='row' justifyContent='center'>
                        <Tooltip title={t('add_location')}>
                            <IconButton onClick={() => handleAddNewLocation(plant, storage)}>
                                <NoteAddIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={t('config_storage_popup_title')}>
                            <IconButton onClick={() => handleConfigStorage(plant, storage)}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={t('delete_storage')}>
                            <IconButton onClick={() => handleOpenPopupDelete('storage', plant, storage, null)}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0, paddingLeft: '50px' }} colSpan={9}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1, width: '100%' }}>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align='left' className='admintab-table-header-cell-2' sx={{width: '150px'}}>{t('admin_page_sub_table_location')}</TableCell>
                                        <TableCell align='left' className='admintab-table-header-cell-2'>{t('admin_page_sub_table_effective_date')}</TableCell>
                                        <TableCell align='left' className='admintab-table-header-cell-2'>{t('admin_page_sub_table_status')}</TableCell>
                                        <TableCell align='center' className='admintab-table-header-cell-2'>{t('admin_page_sub_table_action')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {storage.locations.map((location) => (
                                        <TableRow>
                                            <TableCell align='left' className='admintab-table-body-cell'>{location.locationName}</TableCell>
                                            <TableCell align='left' className='admintab-table-body-cell'>{location.effectiveDate}</TableCell>
                                            <TableCell align='center'>
                                                <Stack direction='row' justifyContent='flex-start'>
                                                    <CircleIcon sx={{width: '8px', color: location.status === 'Active' ? '#61eb34' : '#c40502', marginRight: '10px'}}/>
                                                    <span className='admintab-table-body-cell'>{location.status}</span>
                                                </Stack>
                                            </TableCell>
                                            <TableCell align='center'>
                                                <Stack direction='row' justifyContent='center'>
                                                    <Tooltip title={t('config_location')}>
                                                        <IconButton onClick={() => handleConfigLocation(plant, storage, location)}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title={t('delete_location')}>
                                                        <IconButton onClick={() => handleOpenPopupDelete('location', plant, storage, location)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
});

const RowPlant = React.memo((props) => {
    const { row } = props;
    const [open, setOpen] = useState(false);

    const context = useContext(AdminContext)
    const { t } = useTranslation('translation')

    const handleAddNewStorage = (plantInfor) => {
        context.setAddStorage({ plant: plantInfor })
        context.setOpenPopupAddStorage(true)
    }

    const handleConfigPlant = (plantInfor) => {
        context.setConfigPlant({ plant: plantInfor })
        context.setOpenPopupConfigFactory(true)
    }

    const handleOpenPopupDelete = (plantInfor) => {
        context.setDeleteType('plant')
        context.setDeleteObject({ plant: plantInfor })
        context.setOpenPopupDelete(true)
    }

    return (
        <React.Fragment>
            <TableRow sx={{ borderBottom: open ? 'none' : '1px solid rgba(224, 224, 224, 1)'}}>
                <TableCell sx={{backgroundColor: open ? '#ebebeb' : '#ffffff'}}>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell align='left' sx={{backgroundColor: open ? '#ebebeb' : '#ffffff'}} className='admintab-table-body-cell'>{row.plantCode}</TableCell>
                <TableCell align='left' sx={{backgroundColor: open ? '#ebebeb' : '#ffffff'}} className='admintab-table-body-cell'>{row.plantName}</TableCell>
                <TableCell align='left' sx={{backgroundColor: open ? '#ebebeb' : '#ffffff'}} className='admintab-table-body-cell'>{row.address}</TableCell>
                <TableCell align='center' sx={{backgroundColor: open ? '#ebebeb' : '#ffffff'}}>
                    <Stack direction='row' justifyContent='flex-start'>
                        <CircleIcon sx={{width: '8px', color: row.status === 'Active' ? '#61eb34' : '#c40502', marginRight: '10px'}}/>
                        <span className='admintab-table-body-cell'>{row.status}</span>
                    </Stack>
                </TableCell>
                <TableCell align='center' sx={{backgroundColor: open ? '#ebebeb' : '#ffffff'}}>
                    <Stack direction='row' justifyContent='center'>
                        <Tooltip title={t('add_new_storage_popup_title')}>
                            <IconButton onClick={() => handleAddNewStorage(row)}>
                                <NoteAddIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={t('config_factory_popup_title')}>
                            <IconButton onClick={() => handleConfigPlant(row)}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={t('delete_plant')}>
                            <IconButton onClick={() => handleOpenPopupDelete(row)}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0, paddingLeft: '50px' }} colSpan={9}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1, width: '100%' }}>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align='center' className='admintab-table-header-cell-1'></TableCell>
                                        <TableCell align='left' className='admintab-table-header-cell-1' sx={{width: '150px'}}>{t('admin_page_sub_table_storage')}</TableCell>
                                        <TableCell align='left' className='admintab-table-header-cell-1'>{t('admin_page_sub_table_effective_date')}</TableCell>
                                        <TableCell align='center' className='admintab-table-header-cell-1'>{t('admin_page_sub_table_active_devices')}</TableCell>
                                        <TableCell align='center' className='admintab-table-header-cell-1'>{t('admin_page_sub_table_standard')}</TableCell>
                                        <TableCell align='left' className='admintab-table-header-cell-1'>{t('admin_page_sub_table_status')}</TableCell>
                                        <TableCell align='center' className='admintab-table-header-cell-1'>{t('admin_page_sub_table_action')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.storages.map((storage) => (
                                        <RowStorage plant={row} storage={storage}/>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
});

const AdminTab = () => {
    const context = useContext(AdminContext)
    const [valueSearch, setValueSearch] = useState('')
    const [submitChange, setSubmitChange] = useState(false)
    const [plantRows, setPlantRows] = useState([])

    const { t } = useTranslation('translation')

    const handleTypeEnter = (event) => {
        if (event.key === 'Enter') {
            setSubmitChange(!submitChange)
        }
    }

    const handleSubmitSearch = () => {
        setSubmitChange(!submitChange)
    }

    const handleAddNewFactory = () => {
        context.setOpenPopupAddFactory(true)
    }
    
    useEffect(() => {
        const fetchData = async () => {
            const resultApi = await API.adminService.searchDataTable(valueSearch)
            if (resultApi && resultApi.data && resultApi.data.data) {
                setPlantRows(resultApi.data.data)
            }
        }
        fetchData()
    }, [submitChange, context.refreshDataTable])

    return (
        <div className='admintab-container-0'>
            <div className='d-flex flex-row row align-items-center mt-2 mb-3'>
                <div className='col d-flex flex-row justify-content-start' style={{ marginLeft: '20px' }}>
                    <TextField  id="outlined-search" label={t('admin_page_dropdown_factory')} placeholder={t('admin_page_dropdown_factory_placeholder')}
                        type="search" value={valueSearch} onKeyDown={handleTypeEnter} onChange={(event) => setValueSearch(event.target.value)}
                        InputProps={{
                            classes: {
                                root: 'admintab-root-outlined-input-custom',
                                notchedOutline: 'admintab-root-not-outlined-input-custom'
                            }                      
                        }}
                    />
                    <div className='d-flex align-items-center justify-content-center admin-search-button' onClick={handleSubmitSearch}>
                        <SearchIcon />
                    </div>
                </div>
                <div className='col d-flex justify-content-end justify-content-end' style={{ marginRight: '20px' }}>
                    <Button variant="contained" className='admin-add-new-btn' startIcon={<CreateNewFolderIcon fontSize='small' />} 
                        classes={{root: 'admin-add-new-btn-root'}} onClick={handleAddNewFactory}
                    >
                        {t('admin_page_add_new_btn')}
                    </Button>
                </div>
            </div>

            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell className='admintab-table-header-cell' />
                            <TableCell align="left" className='admintab-table-header-cell'>{t('admin_page_factory_code')}</TableCell>
                            <TableCell align="left" className='admintab-table-header-cell'>{t('admin_page_factory_name')}</TableCell>
                            <TableCell align="left" className='admintab-table-header-cell'>{t('admin_page_factory_address')}</TableCell>
                            <TableCell align="left" className='admintab-table-header-cell'>{t('admin_page_factory_status')}</TableCell>
                            <TableCell align="center" className='admintab-table-header-cell'>{t('admin_page_factory_action')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {plantRows.map((row) => (
                            <RowPlant row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <PopupAddNewFactory />
            <PopupAddNewStorage />
            <PopupAddNewLocation />
            <PopupConfigFactory />
            <PopupConfigStorage />
            <PopupConfigLocation />
            <PopupDelete />
        </div>
    )
}

export default AdminTab;