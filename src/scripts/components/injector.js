import React from 'react';
import { ThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { contentInjection, findBySubject } from '../services/api.controller';
import CreateIcon from '@material-ui/icons/Create';
import CheckIcon from '@material-ui/icons/Check';
import { Grid } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import { green, red, grey, blue, yellow } from '@material-ui/core/colors';
import Zoom from '@material-ui/core/Zoom';
import Fab from '@material-ui/core/Fab';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import clsx from 'clsx';


const styles = (theme) => ({
    injectContainer: {
        marginTop: '10vh',
        marginLeft: '5vw',
    },
    marginOnLeft: {
        marginLeft: '2vw',
        marginTop: '2vh',
        marginBottom: '5vh'
    },
    lList: {
        [theme.breakpoints.up('sm')]: {
            height: '55vh',
            overflowY: 'auto'
        }
    },
    pList: {
        paddingLeft: theme.spacing(4),
        paddingTop: 0,
        paddingBottom: 0
    },
    fabStyle: {
        position: 'fixed',
        left: '80vw',
        top: '80vh',
        color: 'white'
    },
    greenColor: {
        background: green[500]
    },
    greyColor: {
        background: grey[500]
    },
    redColor: {
        background: red[500]
    },
    blueColor: {
        background: blue[500]
    },
    yellowIcon: {
        color: yellow[600]
    }
});

class Injector extends React.Component {

    constructor(props){
        super(props);
        this.darkTheme = createMuiTheme({
            palette: {
                type: 'light'
            },
        });
        this.state = {
            conjecture: '',
            typeHelperText: '',
            conjectureHelperText: '',
            validate: 0,
            comparactor: [],
            ontls: [],
            compHeader: [],
            headerSet: [],
            open: []
        };

        this.checkIcons = [{
            name: 'Invia la tupla',
            class: 'blueColor',
            elem: <CreateIcon />
        }, {
            name: 'Sintassi errata',
            class: 'redColor',
            elem: <ErrorOutlineIcon />
        }, {
            name: 'Digerita',
            class: 'greenColor',
            elem: <CheckIcon />
        }, {
            name: 'Sto elaborando...',
            class: 'greyColor',
            elem: <HourglassEmptyIcon />
        }];

        addEventListener('changeConjecture', (e) => {
            this.setState({
                validate: 0,
                conjecture: e.detail
            });
        })
    }

    inject = (event) => {
        event.preventDefault();

        if(this.state.validate > 1)
            return;

        let cHelper = this.state.conjecture === '' ? 'Scrivi la tua Conjecture' : '';
        this.setState({
            conjectureHelperText: cHelper
        });

        if(this.state.conjecture) {
            this.setState({validate: 3});

            contentInjection(this.state.conjecture)
                .then((res) => {
                    this.setState({ validate: 2 });

                    let subjects = [];
                    let repList = [];

                    let anon = res.sparql ? 'Risultati' : 'Asserzioni di default:';

                    let start = {};
                    let headCallback = (tot, cur, index) => {
                        let title = cur.ctx != "" ? cur.ctx : anon;
                        if (tot[title])
                            tot[title].push(index);
                        else
                            tot[title] = [index];
                        return tot;
                    }

                    if (res.sparql) {
                        let headers = res.graphyList.reduce(headCallback, start);
                        let headerSet = Object.keys(headers);
                        this.setState({
                            compHeader: headers,
                            headerSet: headerSet,
                            comparactor: res.graphyList.map((e) => {
                                return e.predicate;
                            }),
                            ontls: res.strList,
                            open: headerSet.map((e) => {
                                return false;
                            })
                        });
                    } else {
                        Array.from(res.data).forEach((e) => {
                            try {
                                subjects.push(e.subject.value)
                            } catch {
                                repList.push(JSON.stringify(e));
                            }
                            this.setState({
                                comparactor: repList,
                                ontls: repList
                            });
                        });
                        if (subjects.length > 0)
                            findBySubject(subjects)
                                .then((value) => {
                                    let headers = value.graphyList.reduce(headCallback, start);
                                    let headerSet = Object.keys(headers);
                                    this.setState({
                                        compHeader: headers,
                                        headerSet: headerSet,
                                        comparactor: value.graphyList.map((e) => {
                                            return e.predicate;
                                        }),
                                        ontls: value.strList,
                                        open: headerSet.map((e) => {
                                            return false;
                                        })
                                    });
                                });
                    }     
                            
                }).catch((err) => {
                    this.setState({
                        validate: 1,
                        conjectureHelperText: 'Sintassi errata: verifica la tua Conjecture.'
                    });
                });
        }
            
    }

    handleChange = (prop) => (event) => {
        this.setState({ [prop]: event.target.value });
        this.setState({
            validate: 0,
            conjectureHelperText: ''});
    }

    handleOpen = (event) => {
        let tmp = this.state.open;
        let index = event.currentTarget.getAttribute('oindex');
        tmp[index] = !tmp[index];
        this.setState({
            open: tmp
        })
    }

    changeText = (event) => {
        this.setState({ 
            validate: 0,
            conjecture: this.state.ontls[event.currentTarget.getAttribute('value')]
        });
    }

    render() {
        const {classes} = this.props;
        return (
            <ThemeProvider theme={this.darkTheme}>
                <div className={classes.injectContainer}>
                    <form onSubmit={this.inject}>
                        <Grid container >
                            <Grid item xs={10} sm={6}>
                                <TextField
                                    error={!(this.state.conjectureHelperText === '')}
                                    id="text-injector"
                                    label="Conjector Injection"
                                    multiline
                                    rows={15}
                                    variant="outlined"
                                    onChange={this.handleChange('conjecture')}
                                    fullWidth={true}
                                    helperText={this.state.conjectureHelperText}
                                    name="conjecture"
                                    value={this.state.conjecture}
                                />
                            </Grid>
                            <Grid item xs={10} sm={5} 
                            className={classes.marginOnLeft} >
                                <List className={classes.lList}>
                                    {this.state.headerSet.map((val, hIndex) => 
                                        (<div key={'div-'+hIndex}>
                                        <ListItem button
                                            onClick={this.handleOpen}
                                            oindex={hIndex}
                                            key={'collapser-' + val}>
                                            <ListItemText
                                                primary={val == 'undefined' ? "Nessuna corrispondenza" : val} />
                                                {this.state.open[hIndex] ? <ExpandLess /> : <ExpandMore />}
                                            </ListItem>
                                            <Collapse in={this.state.open[hIndex]} timeout="auto" unmountOnExit>
                                            {val != "undefined" ?
                                            this.state.compHeader[val].map((elem) => (
                                                    <ListItem button
                                                        key={'interp-' + elem}
                                                        value={elem}
                                                        onClick={this.changeText}
                                                        className={classes.pList}>
                                                        <ListItemText
                                                            primary={`${this.state.comparactor[elem] || 
                                                                "Nessuna corrispondenza"}`} />
                                                    </ListItem>
                                                )) : null }
                                            </Collapse>
                                        </div>
                                    ))}
                                    </List>
                                
                            </Grid>                            
                        </Grid>
                                {this.checkIcons.map((icon, index) => (
                                        <Zoom
                                            key={icon.name}
                                            in={this.state.validate === index}
                                            style={{
                                                transitionDelay: 
                                                `${this.state.validate === index ? 200 : 0}ms`,
                                            }}
                                            unmountOnExit>
                                            <Fab
                                                color="inherit"
                                                aria-label={icon.name}
                                                type="submit"
                                                title={icon.name}
                                                className={clsx(classes.fabStyle, classes[icon.class])}>
                                                {icon.elem}
                                            </Fab>
                                        </Zoom>
                                ))
                                }
                    </form>
                </div>
            </ThemeProvider>
        )
    }
}

export default withStyles(styles, { withTheme: true })(Injector);