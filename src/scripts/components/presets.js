import React from 'react';
import { ThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import { ListItem, List, ListItemIcon,
	ListItemText, Typography } from '@material-ui/core';
import { getPrefixes } from '../services/api.controller';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';

const styles = (theme) => ({
	container: {
		marginTop: '5vh',
		marginLeft: '5vw',
		marginBottom: '10vh'
	}
});


class Presets extends React.Component {

	constructor(props) {
		super(props);
		this.darkTheme = createMuiTheme({
			palette: {
				type: 'light'
			},
		});

		

		this.state = {
			prefixes: []
		}

		getPrefixes()
			.then((data) => {
				this.setState({
					prefixes: data
				});
			});
	}

	render() {
		const { classes } = this.props;
		return(
			<div className={classes.container}>
				<Typography variant="h6">
					Elenco delle ontologie ed asserzioni presenti a sistema di default:
				</Typography>
				<List>
					{this.state.prefixes.map((val, index) => (
						<ListItem
							key={'preset-' + index}>
							<ListItemIcon>
								<EmojiPeopleIcon />
							</ListItemIcon>
							<ListItemText
								primary={val} />
						</ListItem>
					))}
				</List>
			</div>
			
		)
	}
}

export default withStyles(styles, { withTheme: true })(Presets);