/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react'
import * as CSS from 'csstype'
import {
  StyledWrapper,
  StyledText,
  StyledRemove,
  StyledToggle,
  StyledTHSite,
  StyledTHOther,
  StyledTHLast
} from './style'
import Table, { Row } from '../table';
import Profile, { Provider } from '../profile';

interface ProfileCell {
  verified: boolean
  name: string
  provider?: Provider
  src: string
}

export interface DetailRow {
  profile: ProfileCell
  attention: number
  onRemove?: () => void
}

export interface Props {
  id?: string
  header: string[]
  children?: React.ReactNode
  rows?: DetailRow[]
  numSites?: number
  allSites?: boolean
  onShowAll?: () => void
  showRowAmount?: boolean
  theme?: Theme
}

interface Theme {
  headerColor?: CSS.Color
}

const removeIcon = require('./assets/close')

/*
  TODO
  - add local
  - add optional border above
 */
export default class ContributeTable extends React.PureComponent<Props, {}> {
  getHeader = (header: string[]) => {
    if (!header) {
      return
    }

    let theme = {}

    if (this.props.theme && this.props.theme.headerColor) {
      theme = {
        border: 'none',
        'border-bottom': `1px solid ${this.props.theme.headerColor}`,
        padding: '0',
        color: this.props.theme.headerColor
      }
    }

    return header.map((item: string, i: number) => {
      return {
        content: i === 0
        ? <StyledTHSite>{item}</StyledTHSite>
        : (i - 1) === header.length
          ? <StyledTHOther>{item}</StyledTHOther>
          : <StyledTHLast>{item}</StyledTHLast>,
        theme: theme
      }
    })
  }

  getRows = (rows?: DetailRow[]): Row[] | undefined => {
    if (!rows) {
      return
    }

    return rows.map((row: DetailRow): Row => {
      const cell: Row = {
        content: [
          {
            content: <Profile
              title={row.profile.name}
              provider={row.profile.provider}
              verified={row.profile.verified}
              type={'small'}
              src={row.profile.src}
            />
          },
          {
            content: <StyledText>
              {row.attention}% <StyledRemove onClick={row.onRemove}>{removeIcon}</StyledRemove>
            </StyledText>
          }
        ]
      }

      if (this.props.showRowAmount) {
        const remaining = 100 - row.attention
        cell.theme = {
          background: `linear-gradient(90deg, #FFF ${remaining}%, #d2c6f3 ${row.attention}%)`
        }
      }

      return cell
    })
  }

  render () {
    const { id, header, children, rows, numSites, allSites, onShowAll } = this.props

    return (
      <StyledWrapper id={id}>
        <Table
          header={this.getHeader(header)}
          children={children}
          rows={this.getRows(rows)}
        />
        {
          !allSites
          ? <StyledToggle onClick={onShowAll}>See all {numSites || 0} sites</StyledToggle>
          : null
        }
      </StyledWrapper>
    )
  }
}