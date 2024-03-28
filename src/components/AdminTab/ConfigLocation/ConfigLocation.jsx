import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { FormControl, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../../context/AdminContext';
import API from '../../../api/api';
import { toast } from 'react-toastify'; 
import { convert_DD_MM_YYYY_to_YYYY_MM_DD, initToast } from '../../../utils/helper';
import { ToastId } from '../../../config/app.config';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import moment from 'moment';
import './ConfigLocation.scss';

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

const ConfigLocation = () => {
    const context = useContext(AdminContext)
    const { t } = useTranslation('translation')

    const [locationInfor, setLocationInfor] = useState({
        baCode: '5096',
        plantCode: context.configLocation?.plant?.plantCode || '',
        plantName: context.configLocation?.plant?.plantName || '',
        storageId: context.configLocation?.storage?.storageId || 0,
        storageName: context.configLocation?.storage?.storageName || '',
        locationName: context.configLocation?.location?.locationName || '',
        status: context.configLocation?.location?.status ? (context.configLocation?.location?.status === 'Active' ? 1 : 0) : '',
        effectiveDate: context.configLocation?.location?.effectiveDate ? convert_DD_MM_YYYY_to_YYYY_MM_DD(context.configLocation?.location?.effectiveDate) : moment().format('YYYY-MM-DD')
    })
    const [confirm, setConfirm] = useState(false)

    const handleChangeLocationName = (newValue) => {
        setLocationInfor(prev => ({ ...prev, locationName: newValue }))
    }

    const handleChangeLocationStatus = (newValue) => {
        setLocationInfor(prev => ({ ...prev, status: newValue }))
    }

    const handleChangeEffectiveDate = (newValue) => {
        setLocationInfor(prev => ({ ...prev, effectiveDate: newValue }))
    }

    const handleClose = () => context.setOpenPopupConfigLocation(false)

    const handleClickConfirmButton = () => {
        setConfirm(true)
    }
 
    useEffect(() => {
        setLocationInfor({
            baCode: '5096',
            plantCode: context.configLocation?.plant?.plantCode || '',
            plantName: context.configLocation?.plant?.plantName || '',
            storageId: context.configLocation?.storage?.storageId || 0,
            storageName: context.configLocation?.storage?.storageName || '',
            locationName: context.configLocation?.location?.locationName || '',
            status: context.configLocation?.location?.status ? (context.configLocation?.location?.status === 'Active' ? 1 : 0) : '',
        effectiveDate: context.configLocation?.location?.effectiveDate ? convert_DD_MM_YYYY_to_YYYY_MM_DD(context.configLocation?.location?.effectiveDate) : moment().format('YYYY-MM-DD')
        })
    }, [context.configLocation])
    
    useEffect(() => {
        if (confirm) {
            const postData = async () => {
                initToast(ToastId.ConfigLocation)
                try {
                    const resultApi = await API.adminService.updateLocation({
                        baCode: locationInfor.baCode,
                        plantCode: locationInfor.plantCode,
                        storageId: locationInfor.storageId,
                        locationId: context.configLocation?.location?.locationId || 0,
                        locationName: locationInfor.locationName,
                        remark: '',
                        isActived: locationInfor.status || 0,
                        effectiveDate: locationInfor.effectiveDate
                    })
                    if (resultApi && resultApi.data && resultApi.data.code === 0) {
                        context.setOpenPopupConfigLocation(false)
                        context.setRefreshDataTable(prev => !prev)
                        toast.update(ToastId.ConfigLocation, { 
                            render: "Cấu hình Location thành công", 
                            type: "success", 
                            isLoading: false, 
                            autoClose: 2000 
                        })
                    } else {
                        toast.update(ToastId.ConfigLocation, { 
                            render: resultApi.data.message || "Cấu hình Location thất bại", 
                            type: "error", 
                            isLoading: false, 
                            autoClose: 3000 
                        })
                    }
                } catch (err) {
                    toast.update(ToastId.ConfigLocation, { 
                        render: err.response.data.message || "Cấu hình Location thất bại", 
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
                open={context.openPopupConfigLocation} onClose={handleClose} 
                aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description"
                className='add-new-storage-popup'
            >
                <Box sx={modalStyle}>
                    <div className='add-new-storage-popup-header'>
                        <div className='add-new-storage-popup-header-title'>{t('config_location')}</div>
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
                        <div className='config-storage-popup-body-text-field'>
                            <FormControl fullWidth>
                                <InputLabel>{t('popup_dropdown_status')}</InputLabel>
                                <Select label={t('popup_dropdown_status')} 
                                    value={locationInfor.status} onChange={(event) => handleChangeLocationStatus(event.target.value)}
                                >
                                    <MenuItem value={1}>{t('popup_dropdown_status_active')}</MenuItem>
                                    <MenuItem value={0}>{t('popup_dropdown_status_no_active')}</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className='config-storage-popup-body-text-field'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    <DemoItem>
                                        <DatePicker label={t('config_storage_popup_effective_date')} format='DD-MM-YYYY' 
                                            className='config_storage_popup-date-picker'
                                            value={dayjs(locationInfor.effectiveDate)}
                                            onChange={(value) => handleChangeEffectiveDate(dayjs(value).format('YYYY-MM-DD'))}
                                        />
                                    </DemoItem>
                                </DemoContainer>
                            </LocalizationProvider>
                        </div>
                        <Button variant="contained" fullWidth className='add-new-storage-popup-body-add-btn'
                            onClick={handleClickConfirmButton}
                        >
                            {t('confirm_btn')}
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default ConfigLocation;