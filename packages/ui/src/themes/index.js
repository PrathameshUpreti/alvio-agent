import { createTheme } from '@mui/material/styles'

// assets
import colors from '@/assets/scss/_themes-vars.module.scss'

// project imports
import componentStyleOverrides from './compStyleOverride'
import themePalette from './palette'
import themeTypography from './typography'

/**
 * Represent theme style and structure as per Material-UI
 * @param {JsonObject} customization customization parameter object
 */

export const theme = (customization) => {
    const color = colors

    const themeOption = customization.isDarkMode
        ? {
              colors: color,
              heading: color.darkTextTitle,
              paper: color.darkPaper,
              backgroundDefault: color.darkBackground,
              background: color.darkLevel1,
              darkTextPrimary: color.darkTextPrimary,
              darkTextSecondary: color.darkTextSecondary,
              textDark: color.darkTextTitle,
              menuSelected: color.darkSecondaryDark,
              menuSelectedBack: color.darkSecondaryLight,
              divider: color.darkLevel2,
              customization
          }
        : {
              colors: color,
              heading: color.grey900,
              paper: color.paper,
              backgroundDefault: color.grey50,
              background: color.primaryLight,
              darkTextPrimary: color.grey700,
              darkTextSecondary: color.grey500,
              textDark: color.grey900,
              menuSelected: color.secondaryDark,
              menuSelectedBack: color.secondaryLight,
              divider: color.grey200,
              customization
          }

    const themeOptions = {
        direction: 'ltr',
        palette: themePalette(themeOption),
        mixins: {
            toolbar: {
                minHeight: '48px',
                padding: '16px',
                '@media (min-width: 600px)': {
                    minHeight: '48px'
                }
            }
        },
        typography: themeTypography(themeOption),
        shape: {
            borderRadius: 8
        },
        shadows: [
            'none',
            '0px 2px 6px rgba(0, 0, 0, 0.08)',
            '0px 3px 8px rgba(0, 0, 0, 0.1)',
            '0px 3px 10px rgba(0, 0, 0, 0.12)',
            '0px 4px 12px rgba(0, 0, 0, 0.15)',
            '0px 5px 14px rgba(0, 0, 0, 0.17)',
            '0px 5px 16px rgba(0, 0, 0, 0.2)',
            '0px 6px 18px rgba(0, 0, 0, 0.22)',
            '0px 7px 20px rgba(0, 0, 0, 0.25)',
            '0px 8px 22px rgba(0, 0, 0, 0.27)',
            '0px 9px 24px rgba(0, 0, 0, 0.3)',
            '0px 10px 26px rgba(0, 0, 0, 0.32)',
            '0px 11px 28px rgba(0, 0, 0, 0.35)',
            '0px 12px 30px rgba(0, 0, 0, 0.37)',
            '0px 13px 32px rgba(0, 0, 0, 0.4)',
            '0px 14px 34px rgba(0, 0, 0, 0.42)',
            '0px 15px 36px rgba(0, 0, 0, 0.45)',
            '0px 16px 38px rgba(0, 0, 0, 0.47)',
            '0px 17px 40px rgba(0, 0, 0, 0.5)',
            '0px 18px 42px rgba(0, 0, 0, 0.52)',
            '0px 19px 44px rgba(0, 0, 0, 0.55)',
            '0px 20px 46px rgba(0, 0, 0, 0.57)',
            '0px 21px 48px rgba(0, 0, 0, 0.6)',
            '0px 22px 50px rgba(0, 0, 0, 0.62)',
            '0px 23px 52px rgba(0, 0, 0, 0.65)'
        ]
    }

    const themes = createTheme(themeOptions)
    themes.components = componentStyleOverrides(themeOption)

    return themes
}

export default theme
