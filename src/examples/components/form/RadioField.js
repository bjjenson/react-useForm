import React from 'react'
import PropTypes from 'prop-types'
import { withStyles, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, FormHelperText } from '@material-ui/core' // eslint-disable-line import/no-extraneous-dependencies

const RadioField = ({ classes, value, onChange, helperText, error, label, options }) => {
  return (
    <FormControl component='fieldset' error={error} className={classes.root}>
      <FormLabel component='legend'>{label}</FormLabel>
      <RadioGroup
        value={value}
        onChange={onChange}
      >
        {options.map(o => (
          <FormControlLabel key={o.value} value={o.value} control={<Radio />} label={o.label} />
        ))}
      </RadioGroup>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  )
}

RadioField.propTypes = {
  error: PropTypes.bool,
  helperText: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
}

RadioField.defaultProps = {
  error: false,
  helperText: '',
  label: '',
}

const styles = {
  root: {
    marginTop: 12,
  },
}

export default withStyles(styles)(RadioField)
