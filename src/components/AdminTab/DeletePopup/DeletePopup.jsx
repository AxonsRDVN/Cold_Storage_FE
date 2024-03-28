import Modal from 'react-bootstrap/Modal';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../../context/AdminContext';
import './DeletePopup.scss';
import { ToastId } from '../../../config/app.config';
import API from '../../../api/api';
import { toast } from 'react-toastify';
import { initToast } from '../../../utils/helper';

const DeletePopup = () => {
    const context = useContext(AdminContext)
    const { t } = useTranslation('translation')

    const [confirmDelete, setConfirmDelete] = useState(false)

    const getConfirmText = () => {
        let text = '';
        switch (context.deleteType) {
            case 'plant':
                text = t('delete_popup_plant_question') + ' <strong>' 
                        + (context?.deleteObject?.plant?.plantName || '') 
                        + '</strong> ' + t('delete_popup_remove_plant') + '?'
                break;
            case 'storage':
                text = t('delete_popup_storage_question') + ' <strong>' 
                        + (context?.deleteObject?.storage?.storageName || '') 
                        + '</strong> ' + t('delete_popup_remove_storage') 
                        + ' <strong>' + (context?.deleteObject?.plant?.plantName || '') + '</strong>?'
                break;
            case 'location':
                text = t('delete_popup_location_question') + ' <strong>' 
                + (context?.deleteObject?.location?.locationName || '') 
                + '</strong> ' + t('delete_popup_remove_location') 
                + ' <strong>' + (context?.deleteObject?.storage?.storageName || '') + '</strong>?'
                break;
            default:
                break;
        }
        return text
    }

    const closePopup = () => context.setOpenPopupDelete(false)

    const confirmDeleteClick = () => {
        setConfirmDelete(true)
    }

    useEffect(() => {
        if (confirmDelete) {
            const postData = async () => {
                initToast(ToastId.Delete)
                try {
                    const resultApi = await API.adminService.delete({
                        deleteType: context.deleteType,
                        plantCode: context?.deleteObject?.plant?.plantCode || '',
                        storageId: context?.deleteObject?.storage?.storageId || 0,
                        locationId:  context?.deleteObject?.location?.locationId || 0
                    })
                    if (resultApi && resultApi.data && resultApi.data.code === 0) {
                        context.setOpenPopupDelete(false)
                        context.setRefreshDataTable(prev => !prev)
                        toast.update(ToastId.Delete, { 
                            render: "Xóa thành công", 
                            type: "success", 
                            isLoading: false, 
                            autoClose: 2000 
                        })
                    } else {
                        toast.update(ToastId.Delete, { 
                            render: resultApi.data.message || "Xóa thất bại", 
                            type: "error", 
                            isLoading: false, 
                            autoClose: 3000 
                        })
                    }
                }  catch (err) {
                    toast.update(ToastId.Delete, { 
                        render: err.response.data.message || "Xóa thất bại", 
                        type: "error", 
                        isLoading: false, 
                        autoClose: 3000 
                    })
                }
                setConfirmDelete(false)
            }
            postData()
        }
    }, [confirmDelete])

    return (
        <div>
            <Modal show={context.openPopupDelete} centered onHide={closePopup}
                className='delete-popup-modal'
                backdropClassName='delete-poup-backdrop-modal'
            >
                <Modal.Header>
                    <Modal.Title as='h5' className='delete-popup-title'>{t('delete_popup_title')}</Modal.Title>
                </Modal.Header>
                <Modal.Body as='div'>
                    <div className='delete-popup-content' dangerouslySetInnerHTML={{__html: getConfirmText()}}></div>
                    <div className='d-flex flex-row justify-content-end'>
                        <Button variant="contained" fullWidth className='delete-popup-confirm-btn' onClick={confirmDeleteClick}>{t('confirm_btn')}</Button>
                        <Button variant="contained" fullWidth className='delete-popup-cancel-btn' onClick={closePopup}>{t('cancel_btn')}</Button>                     
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default DeletePopup;