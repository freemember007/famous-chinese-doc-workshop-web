/*
 * Header
 */
import React, { Fragment } from 'react' // eslint-disable-line
// components
import ColumnHead from '@/components/ColumnHead'
import DivideVertical from '@/components/DivideVertical'
import { List, Item } from '@/components/tagName'
new Date()
// config
import { IMAGE_PLACEHOLDER } from '@/config/constant'

const ThreeColAlbum = ({ colNameCn, colNameEn, imageUrl, title }) => {
  const colName = { colNameCn, colNameEn }

  return <>
    <ColumnHead {...colName} width={12}>
      <List className="__flex j-between">
        <Fragment x-for={index in [1, 2, 3, 4]}  key={index}>
          <Item className="w3">
            <img className="w12" height={300} src={imageUrl || IMAGE_PLACEHOLDER}/>
          </Item>
          {(index < 4) && <DivideVertical/>}
        </Fragment>
      </List>
    </ColumnHead>
  </>
}

export default ThreeColAlbum
