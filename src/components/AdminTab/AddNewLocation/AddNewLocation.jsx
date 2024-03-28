import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../../context/AdminContext';
import API from '../../../api/api';
import { toast } from 'react-toastify'; 
import { initToast } from '../../../utils/helper';
import { ToastId } from '../../../config/app.config';
import './AddNewLocation.scss';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '100%',
    transform: 'translate(-100%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderWidth: 0,
    boxShadow: 24,
    height: '100vh'
};

const AddNewLocation = () => {
    const context = useContext(AdminContext)
    const { t } = useTranslation('translation')

    const [locationInfor, setLocationInfor] = useState({
        baCode: '5096',
        plantCode: context.addLocation?.plant?.plantCode || '',
        plantName: context.addLocation?.plant?.plantName || '',
        storageId: context.addLocation?.storage?.storageId || 0,
        storageName: context.addLocation?.storage?.storageName || '',
        locationName: ''
    })
    const [confirm, setConfirm] = useState(false)

    const handleChangeLocationName = (newValue) => {
        setLocationInfor(prev => ({ ...prev, locationName: newValue }))
    }

    const handleClose = () => context.setOpenPopupAddLocation(false)

    const handleClickConfirmButton = () => {
        setConfirm(true)
    }
 
    useEffect(() => {
        setLocationInfor({
            baCode: '5096',
            plantCode: context.addLocation?.plant?.plantCode || '',
            plantName: context.addLocation?.plant?.plantName || '',
            storageId: context.addLocation?.storage?.storageId || 0,
            storageName: context.addLocation?.storage?.storageName || '',
            locationName: ''
        })
    }, [context.addLocation])
    
    useEffect(() => {
        if (confirm) {
            const postData = async () => {
                initToast(ToastId.CreateLocation)
                try {
                    const resultApi = await API.adminService.createLocation({
                        baCode: locationInfor.baCode,
                        plantCode: locationInfor.plantCode,
                        storageId: locationInfor.storageId,
                        locationName: locationInfor.locationName
                    })
                    if (resultApi && resultApi.data && resultApi.data.code === 0) {
                        context.setOpenPopupAddLocation(false)
                        context.setRefreshDataTable(prev => !prev)
                        toast.update(ToastId.CreateLocation, { 
                            render: "Tạo Location thành công", 
                            type: "success", 
                            isLoading: false, 
                            autoClose: 2000 
                        })
                    } else {
                        toast.update(ToastId.CreateLocation, { 
                            render: resultApi.data.message || "Tạo Location thất bại", 
                            type: "error", 
                            isLoading: false, 
                            autoClose: 3000 
                        })
                    }
                } catch (err) {
                    toast.update(ToastId.CreateLocation, { 
                        render: err.response.data.message || "Tạo Location thất bại", 
                        type: "error", 
                        isLoading: false, 
                        autoClose: 3000 
                    })
                }
                setConfirm(false)
            }
            postData()
        }
    }, [confirm])
    
    return (
        <div>
            <Modal 
                open={context.openPopupAddLocation} onClose={handleClose} 
                aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description"
                className='add-new-storage-popup'
            >
                <Box sx={modalStyle}>
                    <div className='add-new-storage-popup-header'>
                        <div className='add-new-storage-popup-header-title'>{t('add_new_location_popup_title')}</div>
                        <IconButton size='medium' onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div className='add-new-storage-popup-body'>
                        <div className='add-new-storage-popup-body-text-field'>
                            <TextField  variant="outlined" label={t('add_new_factory_popup_factory_code')}
                                placeholder={t('add_new_factory_popup_factory_code_placeholder')} fullWidth disabled
                                value={locationInfor.plantCode}
                            />
                        </div>
                        <div className='add-new-storage-popup-body-text-field'>
                            <TextField  variant="outlined" label={t('add_new_factory_popup_factory_name')}
                                placeholder={t('add_new_factory_popup_factory_name_placeholder')} fullWidth disabled
                                value={locationInfor.plantName}
                            />
                        </div>
                        <div className='add-new-storage-popup-body-text-field'>
                            <TextField  variant="outlined" label={t('add_new_storage_popup_storage_name')} 
                                placeholder={t('add_new_storage_popup_storage_name_placeholder')} fullWidth disabled
                                value={locationInfor.storageName}
                            />
                        </div>
                        <div className='add-new-storage-popup-body-text-field'>
                            <TextField  variant="outlined" label={t('add_new_location_popup_location_name')} 
                                placeholder={t('add_new_location_popup_location_name_placeholder')} fullWidth
                                value={locationInfor.locationName} onChange={(event) => handleChangeLocationName(event.target.value)}
                            />
                        </div>
                        <Button variant="contained" fullWidth className='add-new-storage-popup-body-add-btn'
                            onClick={handleClickConfirmButton}
                        >
                            {t('add_btn')}
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default AddNewLocation;