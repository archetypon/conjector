import React from 'react';
import clsx from 'clsx';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import { ThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import { login } from '../services/api.controller';
import { loadDialog } from '../services/DOMManipulator';
import Link from '@material-ui/core/Link';
import DraftsIcon from '@material-ui/icons/Drafts';

const styles = (theme) => ({
    rootContainer: {
        padding: '6vh 6vw',
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
            flexWrap: 'wrap',
            margin: 'auto',
            marginTop: '3%',
        }
    },
    root: {
        flexWrap: 'wrap',
        margin: 'auto',
        marginTop: '3%',
        padding: '6vh 6vw',
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        }
    },
    margin: {
        margin: '1vw'
    },
    withoutLabel: {
        marginTop: '1vw'
    },
    textField: {
        width: '100%'
    },
    divider: {
        margin: '2vh'
    }
});

class ConjectorLogin extends React.Component {

    constructor(props) {
        super(props);
        this.darkTheme = createMuiTheme({
            palette: {
                type: 'dark'
            },
        });
        this.state = {
            user: '',
            password: '',
            mail: '',
            showPassword: false,
            logState: false,
            ErrorMessage: '',
            registered: props.registered,
            inputStart: false
        };

    }

    handleChange = (prop) => (event) => {
        this.setState({ [prop]: event.target.value, inputStart: true });
    };

    handleClickShowPassword = () => {
        this.setState({ showPassword: !this.state.showPassword });
    };

    handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    handleSubmit = (event) => {
        event.preventDefault();
        let scope;
        this.state.registered? scope = 'auth' : scope = 'register';
        login(this.state.mail, this.state.user, this.state.password, scope)
            .then((res) => {
                window.location.replace('/');
            })
            .catch((err) => {
                this.setState({ logState: true });
                if (err.message === 'WrongCredentialError')
                    loadDialog('Credenziali errate!');
                if (err.message === 'MissingParamError')
                    loadDialog('Inserisci le tue credenziali!');
                if (err.message === 'BadUsageError')
                    loadDialog('Ooops...qualcosa non ha funzionato! :(');
                if (err.message === 'UserTaken')
                    loadDialog('Questo username è già stato preso!')
            });
    }

    register = () => {
        this.setState({registered: !this.state.registered});
    }

    render() {
        const { classes } = this.props;
        return (
            <ThemeProvider theme={this.darkTheme}>
                <div className={classes.rootContainer}>
                    <Paper className={classes.root}>
                        <form onSubmit={this.handleSubmit}>
                            {!this.state.registered?
                            <div>
                                <FormControl className={clsx(classes.margin, classes.textField)}>
                                    <InputLabel htmlFor="mail-box">Email</InputLabel>
                                    <Input
                                        error={!this.state.mail.match(/\w*@\w*\../) && this.state.inputStart}
                                        id="mail-box"
                                        type="email"
                                        value={this.state.mail}
                                        onChange={this.handleChange('mail')}
                                        endAdornment={
                                            <InputAdornment position="start">
                                                <DraftsIcon />
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </div> : null}
                            <div>
                                <FormControl className={clsx(classes.margin, classes.textField)}>
                                    <InputLabel htmlFor="username-box">Username</InputLabel>
                                    <Input
                                        error={this.state.logState && this.state.user === ''}
                                        id="username-box"
                                        type="text"
                                        value={this.state.user}
                                        onChange={this.handleChange('user')}
                                        endAdornment={
                                            <InputAdornment position="start">
                                                <AccountCircle />
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </div>
                            <div>
                                <FormControl className={clsx(classes.margin, classes.textField)}>
                                    <InputLabel htmlFor="password-box">Password</InputLabel>
                                    <Input
                                        error={this.state.logState && this.state.password === ''}
                                        id="password-box"
                                        type={this.state.showPassword ? 'text' : 'password'}
                                        value={this.state.password}
                                        onChange={this.handleChange('password')}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="cambia visibilità della password"
                                                    onClick={this.handleClickShowPassword}
                                                    onMouseDown={this.handleMouseDownPassword}
                                                >
                                                    {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </div>
                            <Typography className={classes.divider} />
                            <Typography align="right">
                                <Button
                                    type="submit"
                                    variant="outlined">
                                    {this.state.registered ? 'Login' : 'Registrati'}
                                </Button>
                            </Typography >
                            <Typography className={classes.divider} />
                            <Typography>
                                <Link
                                    href="#"
                                    onClick={this.register}>
                                    {this.state.registered ? 'Non sei ancora registrato?' : 'Ritorna al login'}
                                </Link>
                            </Typography>   
                        </form>
                    </Paper>
                </div>
            </ThemeProvider>);
        }
}

export default withStyles(styles, { withTheme: true })(ConjectorLogin);