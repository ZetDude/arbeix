import React from 'react';
import { entryStateTypeInternal } from '../reducers/types';
import style from './Entries.css';
import Searchable from './Searchable';
import errors from '../constants/errors.json'

type Props = {
  indent: (add: string) => void;
  dedent: () => void;
  select: () => void;
  entries: entryStateTypeInternal
};

export default function Entries(props: Props) {
  const {
    indent,
    dedent,
    entries,
  } = props;

  const isPath = entries.path.length > 0;
  const isNotFinal = entries.final === undefined;

  function handleSubmit(e: { label: string, value: string }) {
    if (e) {
      indent((e as { label: string, value: string }).value);
    }
  }

  const selectOptions = entries.options.map((i) => ({
    label: i, value: i
  }));

  const previousCategory = isPath ? entries.path.slice(-1)[0] : "Kategooria";

  return (
    <div>
      <div className={style.form + " " + style.sidebyside}>
        <div className={style.left + " " + style.sidebyside}>
          {isPath && <i className={"fa fa-angle-double-left fa-2x " + style.icon} onClick={dedent}/>}
          {!isNotFinal && entries.final !== undefined && <span>{'Valitud toode: ' + entries.final[0] + ' (' + entries.final[1] + ')'}</span>}
          {isNotFinal && <Searchable
            options={selectOptions}
            focused={isPath}
            key={entries.path.slice(-1)[0]}
            onSelect={handleSubmit}
            notFoundText={errors.e101}
            placeholder={previousCategory}
          />}
        </div>
      </div>
    </div>
  );
}
