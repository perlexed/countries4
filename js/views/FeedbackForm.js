
import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import NetworkHelper from '../components/NetworkHelper';

export default class FeedbackForm extends React.PureComponent {

    static propTypes = {
        networkHelper: PropTypes.instanceOf(NetworkHelper),
    };

    constructor() {
        super();

        this.state = {
            isOpened: false,
            feedbackText: '',
            email: '',
            sendResult: null,
        };

        this._onShortcutClick = this._onShortcutClick.bind(this);
        this._onDocumentClick = this._onDocumentClick.bind(this);
        this._sendFeedback = this._sendFeedback.bind(this);
        this._onFeedbackTextChange = this._onFeedbackTextChange.bind(this);
        this._onEmailChange = this._onEmailChange.bind(this);
    }

    componentWillMount() {
        document.addEventListener('click', this._onDocumentClick);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this._onDocumentClick);
    }

    _sendFeedback(event) {
        event.preventDefault();

        if (!this.state.feedbackText.trim().length) {
            return;
        }

        if (this.state.sendResult !== null) {
            this.setState({
                sendResult: null,
            });
        }

        this.props.networkHelper.send('/game/send-feedback/', {
            text: this.state.feedbackText,
            email: this.state.email || null,
        })
            .then(response => {
                this.setState({
                    sendResult: !!(response && response.data),
                });
                console.log('response', response);
            })
            .catch(() => {
                this.setState({
                    sendResult: false,
                });
            });
    }

    _onShortcutClick() {
        setTimeout(() => {
            this.setState({ isOpened: !this.state.isOpened });
        });
    }

    _onDocumentClick(event) {
        if (!FeedbackForm._isDescendant(document.getElementById('feedbackFormContainer'), event.target)) {
            setTimeout(() => {
                this.setState({ isOpened: false });
            });
        }
    }

    static _isDescendant(parent, child) {
        if (parent === child) {
            return true;
        }

        let node = child.parentNode;
        while (node != null) {
            if (node === parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }

    _onFeedbackTextChange(event) {
        this.setState({
            feedbackText: event.target.value,
        });
    }

    _onEmailChange(event) {
        this.setState({
            email: event.target.value,
        });
    }

    render() {
        return (
            <div className='feedback-form-outer-container'>
                <div className={cn('feedback-form-inner-container', this.state.isOpened && 'feedback-form-opened')}>
                    {this._renderForm()}

                    <div
                        className='feedback-form_shortcut-container'
                        onClick={this._onShortcutClick}
                    >
                        <img className='feedback-form_shortcut-icon' src='images/feedback.svg' />

                        <div className='feedback-form_shortcut-text'>Оставить отзыв</div>
                    </div>
                </div>
            </div>
        );
    }

    _renderForm() {
        return (
            <form
                onSubmit={this._sendFeedback}
                className='feedback-form form-horizontal'
            >
                <div>
                    <textarea
                        className='form-control'
                        placeholder='Текст отзыва'
                        rows='3'
                        value={this.state.feedbackText}
                        onChange={this._onFeedbackTextChange}
                    />

                    <div className='input-group email-group'>
                        <span className="input-group-addon">@</span>
                        <input
                            type='email'
                            className='form-control'
                            id='feedback-form-email'
                            placeholder='Email (необязательно)'
                            value={this.state.email}
                            onChange={this._onEmailChange}
                        />
                    </div>

                    <div className='feedback-send-container'>
                        <button type='submit' className='btn btn-default'>Отправить</button>
                    </div>

                    {this._renderAlert()}
                </div>
            </form>
        );
    }

    _renderAlert() {
        if (this.state.sendResult === null) {
            return null;
        }

        const alertClass = this.state.sendResult
            ? 'alert-success'
            : 'alert-warning';

        const alertText = this.state.sendResult
            ? 'Ваша информация будет передана, спасибо за обратную связь!'
            : 'Отправить отзыв не удалось. Пожалуйста, попробуйте еще раз.';

        return (
            <div className={cn(['alert', 'feedback-alert', alertClass])}>
                {alertText}
            </div>
        );
    }

}