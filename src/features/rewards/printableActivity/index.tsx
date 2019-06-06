/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react'

// Components
import {
  StyledWrapper,
  StyledTitle,
  StyledSubTitle,
  StyledHeader,
  StyledLeft,
  StyledRight,
  StyledWarning,
  StyledWarningText,
  StyledTables,
  StyledNote,
  StyledTableTitle,
  StyledTableSubTitle,
  StyledVerified,
  StyledVerifiedText,
  StyledAlertWrapper,
  StyledVerifiedIcon,
  StyledMarginWrapper
} from './style'
import TableContribute, { DetailRow as ContributeRow } from '../tableContribute'
import TableTransactions, { DetailRow as TransactionRow } from '../tableTransactions'
import { AlertCircleIcon, VerifiedSIcon } from '../../../components/icons'
import ListToken from '../listToken'
import { Type as TokenType } from '../tokens'

// Utils
import { getLocale } from '../../../helpers'

export interface Token {
  value: string
  converted: string
  isNegative?: boolean
}

export type SummaryType = 'deposit' | 'grant' | 'ads' | 'contribute' | 'recurring' | 'donations'

export interface SummaryItem {
  type: SummaryType
  token: Token
  text: string
  notPaid?: boolean
}

export interface Props {
  contributeRows: ContributeRow[]
  recurringRows: ContributeRow[]
  tipRows: ContributeRow[]
  months: Record<string, string>
  currentMonth: string
  transactionRows: TransactionRow[]
  openBalance?: Token
  closingBalance?: Token
  id?: string
  summary: SummaryItem[]
  total: Token
  paymentDay: string
}

export default class PrintableActivity extends React.PureComponent<Props, {}> {
  private colors: Record<SummaryType, TokenType> = {
    deposit: 'earnings',
    grant: 'earnings',
    ads: 'earnings',
    contribute: 'contribute',
    recurring: 'donation',
    donations: 'donation'
  }

  get headers () {
    return [
      getLocale('rewardsContributeVisited'),
      getLocale('payment')
    ]
  }

  get tipsHeaders () {
    return [
      getLocale('rewardsTipVisited'),
      getLocale('rewardsTipDate'),
      getLocale('payment')
    ]
  }

  get selectTitle () {
    return (
      <StyledTitle>
        {getLocale('braveRewards')} <StyledSubTitle>{getLocale('walletActivity')}</StyledSubTitle>
      </StyledTitle>
    )
  }

  getSummaryBox = () => {
    let items: React.ReactNode[]

    if (!this.props.summary) {
      return null
    }

    items = this.props.summary.map((item: SummaryItem, i: number) => {
      let title: React.ReactNode = item.text

      return (
        <ListToken
          key={`${this.props.id}-summary-${i}`}
          title={title}
          value={item.token.value}
          converted={item.token.converted}
          color={this.colors[item.type]}
          size={'small'}
          border={i === 0 ? 'first' : 'default'}
          isNegative={item.token.isNegative}
        />
      )
    })

    items.push(
      <ListToken
        key={`${this.props.id}-summary-99`}
        title={<b>{getLocale('total')}</b>}
        value={this.props.total.value}
        converted={this.props.total.converted}
        size={'small'}
        border={'last'}
      />
    )

    return items
  }

  render () {
    const {
      contributeRows,
      recurringRows,
      tipRows,
      transactionRows,
      paymentDay
    } = this.props

    return (
      <StyledWrapper>
        <StyledMarginWrapper>
          <StyledHeader>
            <StyledLeft>
              <StyledTitle>{this.selectTitle}</StyledTitle>
            </StyledLeft>
            <StyledRight>
              {this.getSummaryBox()}
            </StyledRight>
          </StyledHeader>
          <StyledWarning>
            <StyledAlertWrapper>
              <AlertCircleIcon />
            </StyledAlertWrapper>
            <StyledWarningText>
              {getLocale('paymentWarning')}
            </StyledWarningText>
          </StyledWarning>
          <StyledTables>
            <StyledTableTitle>{getLocale('transactions')}</StyledTableTitle>
              <TableTransactions
                rows={transactionRows}
              >
                {getLocale('noStatementTransactions')}
              </TableTransactions>
              <StyledTableTitle>
                <span>{getLocale('donationAllocation')}</span>
                <StyledTableSubTitle>
                  {getLocale('paymentMonthly', { day: paymentDay })}
                </StyledTableSubTitle>
              </StyledTableTitle>
              <TableContribute
                header={this.headers}
                rows={recurringRows}
                allSites={true}
                showRowAmount={true}
              >
                {getLocale('noStatementMonthlyContributions')}
              </TableContribute>
            <StyledTableTitle>
              <span>{getLocale('contributeAllocation')}</span>
              <StyledTableSubTitle>
                {getLocale('paymentMonthly', { day: paymentDay })}
              </StyledTableSubTitle>
            </StyledTableTitle>
            <TableContribute
              header={this.headers}
              rows={contributeRows}
              allSites={true}
              showRowAmount={true}
            >
              {getLocale('noStatementAutoContributions')}
            </TableContribute>
            <StyledTableTitle>
              <span>{getLocale('tipAllocation')}</span>
            </StyledTableTitle>
            <TableContribute
              header={this.tipsHeaders}
              rows={tipRows}
              allSites={true}
              showRowAmount={true}
            >
              {getLocale('noStatementTips')}
            </TableContribute>
            <StyledVerified>
              <StyledVerifiedIcon>
                <VerifiedSIcon />
              </StyledVerifiedIcon>
              <StyledVerifiedText>{getLocale('braveVerified')}</StyledVerifiedText>
            </StyledVerified>
          </StyledTables>
          <StyledNote>
            <b>{getLocale('pleaseNote')}</b> {getLocale('activityNote')}
            <br /><br />
            {getLocale('activityCopy')}
          </StyledNote>
        </StyledMarginWrapper>
      </StyledWrapper>
    )
  }
}
