import React from 'react';
import Collapse from '@material-ui/core/Collapse';
import Alert from '@material-ui/lab/Alert';
import { ThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const styles = (theme) => ({
    message: {
        marginTop: '1vh',
        marginLeft: '78vw',
        width: '20vw',
        padding: '0.5vw',
        wordBreak: 'break-word'
    }
});

class ConToast extends React.Component {

    constructor(props) {
        super(props);
        this.darkTheme = createMuiTheme({
            palette: {
                type: 'dark',
            },
        });
        this.state = {
            open: props.open
        };
        this.timer = () => {
            var t = setTimeout(() => {
                this.setState({ open: false });
            }, 2000);

            return {
                stopTimer: () => {
                    clearTimeout(t);
                }
            };
        }

    }

    componentDidMount() {
        this.tick = new this.timer();
    }

    componentWillUnmount() {
        this.tick.stopTimer();
    }

    render() {
        const { classes } = this.props;
        return(
            <ThemeProvider theme={this.darkTheme}>
                <Collapse in={this.state.open} className={classes.message}>
                    <Alert 
                    severity="error" 
                    id="alert-message">
                        <Typography variant="caption">
                            {this.props.toastMessage}
                        </Typography>
                    </Alert>
                </Collapse>
            </ThemeProvider>
            
        )
    }
}

export default withStyles(styles, { withTheme: true })(ConToast);