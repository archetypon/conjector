import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import { ThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import ListItem from '@material-ui/core/ListItem';
import HomeIcon from '@material-ui/icons/Home';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import FormatTextdirectionLToRIcon from '@material-ui/icons/FormatTextdirectionLToR';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import { loadLogin, loadInjector, 
    openHelper, loadExample, loadPresets } from '../services/DOMManipulator';
import { logout } from '../services/api.controller';
import HelpOutline from '@material-ui/icons/HelpOutline';

const styles = (theme) => ({
    menuIcon: {
        marginLeft: '2vw',
        color: 'white'
    },
    helpIcon: {
        float: 'right',
        marginRight: '2vw'
    },
    nested: {
        paddingLeft: theme.spacing(4)
    },
    popover: {
        pointerEvents: 'none',
    },
});

class ConjectorMenu extends React.Component {


    constructor(props) {
        super(props);

        this.examples = {
                "Alexandre Dumas": 
                `<#dumas> a foaf:Person ;
                foaf:name "Alexandre Dumas"^^xsd:string ;
                rdf:Label "Dumas"^^xsd:string ;
                foaf:knows <#poe>.
                <#poe> a foaf:Person ;
                foaf:name "Edgar Allan Poe"^^xsd:string;
                rdf:Label "Allan Poe"^^xsd:string.
                <#montecristo> rdf:Label "Il Conte di Montecristo" ;
                dc:creator <#dumas> ;
                dc:title "Le Comte de Monte-Cristo"^^xsd:string ;
                dc:publisher <#journal-de-debats> ;
                dc:created "1846-01-15"^^xsd:date .
                <#journal-de-debats> rdf:Label "Journal des débats"^^xsd:string .
                dc:creator ppp:hasTemplate "\${object} ha scritto \${subject}"^^xsd:string .`,
                "Progetto Gutenberg": 
                `<#pg> <http://www.w3.org/1999/02/22-rdf-syntax-ns#Label> "Progetto Gutenberg".
                <#pg> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Project>.
                <#pg> <http://purl.org/dc/terms/creator> <#hart>.
                <#pg> <http://purl.org/dc/terms/created> "1971"^^<http://www.w3.org/2001/XMLSchema#date>.
                <#hart> <http://www.w3.org/1999/02/22-rdf-syntax-ns#Label> "Michael Hart".
                <#hart> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person>.`,
                "Cervantes": 
                `?s ?p ?o.
                FILTER regex(str(?s), "cervantes").`
            };

        this.darkTheme = createMuiTheme({
            palette: {
                type: 'dark'
            }
        });
        this.state = {
            anchorEl: null, 
            logged: props.logged,
            open: [false]
        };
        
    }

    handleClick = (event) => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleExpand = (event) => {
        let tmp = this.state.open;
        let index = event.currentTarget.getAttribute('oindex');
        tmp[index] = !tmp[index];
        this.setState({
            open: tmp
        })
    }

    handleClose = () => {
        this.setState({anchorEl: null});
    };

    loadLogin = () => {
        loadLogin(true);
        this.setState({ anchorEl: null });
    }

    loadRegister = () => {
        loadLogin(false);
        this.setState({ anchorEl: null });
    }

    logout = () => {
        logout();
    }

    loadInjector = () => {
        loadInjector();
        this.setState({ anchorEl: null });
    }

    loadPresets = () => {
        loadPresets();
        this.setState({ anchorEl: null });
    }

    helper = () => {
        openHelper();
    }

    handleExempleSelect = (event) => {
        let att = event.currentTarget.getAttribute('rel');
        loadExample(this.examples[att]);
    }

    render() {
        const { classes } = this.props;
        return (
            <ThemeProvider theme={this.darkTheme}>
                <IconButton aria-controls="Apri menu"
                    aria-haspopup="true" onClick={this.handleClick}
                    className={classes.menuIcon}
                    value="Questo è un Hamburger!">
                    <FastfoodIcon />
                </IconButton>
                <Menu
                    id="simple-menu"
                    anchorEl={this.state.anchorEl}
                    keepMounted
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.handleClose}>
                        <ListItemIcon>
                            <HomeIcon fontSize="small" />
                        </ListItemIcon>
                        <Typography variant="inherit">Home</Typography>
                    </MenuItem>
                    { this.state.logged ?
                    <div>
                            <MenuItem onClick={this.loadInjector}>
                                <ListItemIcon>
                                    <RecordVoiceOverIcon fontSize="small" />
                                </ListItemIcon>
                                <Typography variant="inherit">Injector</Typography>
                            </MenuItem>

                            <MenuItem onClick={this.loadPresets}>
                                <ListItemIcon>
                                    <FormatTextdirectionLToRIcon fontSize="small" />
                                </ListItemIcon>
                                <Typography variant="inherit">Presets</Typography>
                            </MenuItem>

                            <MenuItem button oindex={0} onClick={this.handleExpand}>
                                <ListItemIcon>
                                    <ImportContactsIcon fontSize="small" />
                                </ListItemIcon>
                                <Typography variant="inherit">Esempi</Typography>
                                {this.state.open[0] ? <ExpandLess /> : <ExpandMore />}
                            </MenuItem>
                            <Collapse in={this.state.open[0]} timeout="auto" unmountOnExit>
                                <List component="div">
                                    {Object.keys(this.examples).map((el) => (
                                        <ListItem button
                                            onClick={this.handleExempleSelect}
                                            className={classes.nested}
                                            rel={el}
                                            key={'t-' + el}
                                        >
                                            <ListItemText primary={el} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>

                            <Divider variant="inset" />
                            <ListItem>
                                <Typography>
                                    <Link color="inherit" href="#" onClick={this.logout}>
                                        Logout
                                    </Link>
                                </Typography>
                        </ListItem>
                    </div>
                     :
                     <div>
                            <Divider variant="inset" />
                            <ListItem>
                                <Typography>
                                    <Link color="inherit" href="#" onClick={this.loadLogin}>
                                        Login
                                    </Link>
                                    &nbsp;/&nbsp;
                                    <Link color="inherit" href="#" onClick={this.loadRegister}>
                                        Registrati
                                    </Link>
                                </Typography>
                            </ListItem>
                     </div> }
                </Menu>
                <IconButton aria-label="informazioni" 
                className={classes.helpIcon} onClick={this.helper}>
                    <HelpOutline />
                </IconButton>
            </ThemeProvider>        
        );
    }
    
}

export default withStyles(styles, { withTheme: true })(ConjectorMenu);