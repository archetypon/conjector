import React from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { ThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';


const styles = (theme) => ({
    closeButton: {
        float: 'right'
    }
});

class ConjHelp extends React.Component {

    constructor(props) {
        super(props);

        this.darkTheme = createMuiTheme({
            palette: {
                type: 'dark'
            }
        });

        this.state = {open: true}
    }

    handleClose = () => {
        this.setState({open: false});
    };

    render() {

        const { classes } = this.props;

        return(
            <ThemeProvider theme={this.darkTheme}>
                <Dialog onClose={this.handleClose} 
                aria-labelledby="helper-dialog-title" 
                open={this.state.open}>
                    <DialogTitle id="helper-dialog-title" onClose={this.handleClose}>
                        Informazioni
                        <IconButton aria-label="chiudi" 
                        onClick={this.handleClose} 
                        className={classes.closeButton}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Typography gutterBottom>
                            {this.props.helperText}
                        </Typography>
                    </DialogContent>
                </Dialog>
            </ThemeProvider>
        );
    }
}

export default withStyles(styles, { withTheme: true })(ConjHelp);