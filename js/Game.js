
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {Collapse} from 'react-collapse';

import Runner from './components/Runner';
import ActionLogger from './components/ActionLogger';
import GameMode from '../enums/GameMode';

import InfoBlock from './views/infoBlock/InfoBlock';
import MatchedCountries from './views/MatchedCountries';
import RestCountries from './views/RestCountries';
import InputForm from './views/InputForm';
import Timer from './views/Timer';

class Game extends React.Component {

    static propTypes = {
        runnerStatus: PropTypes.string,
        userUid: PropTypes.string,
        runner: PropTypes.instanceOf(Runner),
        store: PropTypes.object,
        actionLogger: PropTypes.instanceOf(ActionLogger),
        gameMode: PropTypes.oneOf([GameMode.MIN2, GameMode.MIN10]),
        statistics: PropTypes.object,
        infoPanelSwitch: PropTypes.oneOf(['stats', 'history']),
        matchedCountries: PropTypes.array,
        toggleInfoPanel: PropTypes.func,
        history: PropTypes.object,
        resetGame: PropTypes.func,
        onCountryMatch: PropTypes.func,
        setGameMode: PropTypes.func,
        elapsedTime: PropTypes.number,
    };

    constructor(props) {
        super(props);

        this.state = {
            isDescriptionOpened: true,
        };

        this._toggleDescription = this._toggleDescription.bind(this);
    }

    _toggleDescription(e) {
        e.preventDefault();
        this.setState({
            isDescriptionOpened: !this.state.isDescriptionOpened,
        })
    }

    render() {
        return (
            <div className='row'>
                <h1 className='text-center main-header'
                >
                    <a href='#' onClick={this._toggleDescription}>Страноведение</a>
                </h1>

                <Collapse isOpened={this.state.isDescriptionOpened}>
                    <section className='text-center description-text'>
                        <p>Цель игры - за ограниченное време указать как можно больше названий стран</p>
                        <p>Указывать следует полное название страны, но для многих стран поддерживается сокращенный вариант написания</p>
                        <p>Отсчет времени начнется сразу после того, как будет введено и отправлено название любой страны</p>
                    </section>
                </Collapse>

                <div className='col-md-7 game-block'>
                    <InputForm
                        runnerStatus={this.props.runnerStatus}
                        runner={this.props.runner}
                        resetGame={this.props.resetGame}
                        matchedCountries={this.props.matchedCountries}
                        actionLogger={this.props.actionLogger}
                        gameMode={this.props.gameMode}
                        onCountryMatch={this.props.onCountryMatch}
                        setGameMode={this.props.setGameMode}
                    />

                    <Timer
                        runnerStatus={this.props.runnerStatus}
                        runner={this.props.runner}
                        elapsedTime={this.props.elapsedTime}
                    />

                    <MatchedCountries
                        countriesList={this.props.matchedCountries}
                    />

                    {this.props.runnerStatus === Runner.STATUS_FINISHED && (
                        <RestCountries
                            countriesList={this.props.matchedCountries}
                        />
                    )}
                </div>

                <InfoBlock
                    infoPanelSwitch={this.props.infoPanelSwitch}
                    statistics={this.props.statistics}
                    toggleInfoPanel={this.props.toggleInfoPanel}
                    history={this.props.history}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        matchedCountries: state.matchedCountries,
        elapsedTime: state.runner.elapsedTime,
        runnerStatus: state.runner.status,
        gameUid: state.runner.gameUid,
        history: state.history,
        gameMode: state.gameMode,
        statistics: state.statistics,
        infoPanelSwitch: state.infoPanelSwitch,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onCountryMatch: countryCode => {
            dispatch({
                type: 'ADD_COUNTRY',
                countryCode: countryCode,
            });
        },
        resetGame: () => {
            dispatch({
                type: 'RESET_COUNTRIES',
            })
        },
        setGameMode: gameMode => {
            dispatch({
                type: 'SET_GAME_MODE',
                gameMode: gameMode,
            });
        },
        toggleInfoPanel: infoPanelName => {
            dispatch({
                type: 'TOGGLE_INFO_PANEL',
                infoPanelName: infoPanelName,
            })
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);