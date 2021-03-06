import Modal from './Modal';
import confirm from './confirm';

Modal.info = function (props) {
    const config = {
        type: 'info',
        iconType: 'info-circle',
        okCancel: false,
        ...props
    }
    return confirm(config);
};

Modal.success = function (props) {
    const config = {
        type: 'success',
        iconType: 'check-circle',
        okCancel: false,
        ...props
    }
    return confirm(config);
};

Modal.warning = function (props) {
    const config = {
        type: 'warning',
        iconType: 'exclamation-circle',
        okCancel: false,
        ...props
    }
    return confirm(config);
};

Modal.error = function (props) {
    const config = {
        type: 'danger',
        iconType: 'close-circle',
        okCancel: false,
        ...props
    }
    return confirm(config);
};

Modal.confirm = function (props) {
    const config = {
        type: 'warning',
        iconType: 'question-circle',
        ...props
    }
    return confirm(config);
};


export default Modal;