import { fetcher } from "../../utils/fetcher"
import cheerio from "cheerio"
import { TIMINGS } from "../../utils/constants"

const worldFetcher = fetcher("https://www.worldometers.info")
const wikiFetcher = fetcher("https://en.wikipedia.org")

const parseNumber = (num) => {
  if (!num) return null
  return Number.parseInt(num.replace(/,/g, ""), 10)
}

const wikiParser = async (url) => {
  try {
    const html = await wikiFetcher(url, {
      toText: true,
    })

    const $ = cheerio.load(html.text)
    const rows = $(".infobox tr")
      .toArray()
      .map(function (el) {
        const keyEl = $("th", el)
        const valueEl = $("td", el)

        for (const tag of ["sup", "a", "small"]) {
          keyEl.find(tag).remove()
          valueEl.find(tag).remove()
        }

        return [
          keyEl.text(),
          valueEl.text().replace(/[,.]/g, "").split(/\s/g).shift(),
        ]
      })

    const payload = ["confirm", "death", "recover"]
      .map((key) => [
        key,
        rows
          .find(([wikiKey]) => wikiKey.toLowerCase().includes(key))
          ?.pop()
          ?.trim(),
      ])
      .reduce((memo, [k, v]) => {
        memo[k] = v
        return memo
      }, {})

    return {
      totalCases: payload.confirm ? Number.parseInt(payload.confirm, 10) : null,
      totalDeaths: payload.death ? Number.parseInt(payload.death, 10) : null,
      totalRecovered: payload.recover
        ? Number.parseInt(payload.recover, 10)
        : null,
    }
  } catch {}

  return null
}

export default async (_, res) => {
  try {
    const html = await worldFetcher("/coronavirus", {
      toText: true,
    })

    const $ = cheerio.load(html.text)

    const table = $("#main_table_countries_today thead + tbody tr")
    const items = {}

    const mainNumber = parseNumber($(".maincounter-number").text())

    table.map(function () {
      let [
        countryName,
        totalCases,
        newCases,
        totalDeaths,
        newDeaths,
        totalRecovered,
      ] = $("td", this)
        .toArray()
        .map((node) => $(node).text())

      items[countryName] = {
        totalCases: parseNumber(totalCases),
        totalDeaths: parseNumber(totalDeaths),
        totalRecovered: parseNumber(totalRecovered),
      }
    })

    const mergeValues = (a, b) => {
      return Object.entries(a)
        .map(([key, value]) => [key, value + b[key] ?? 0])
        .reduce((memo, [k, v]) => {
          memo[k] = v
          return memo
        }, {})
    }

    const resolve = async ({ name, search, wiki, payload, rest }) => {
      if (rest) return null
      if (Array.isArray(search)) {
        const multiple = search.map((k) => [k, items[k]])

        const combined = multiple
          .filter(([_, v]) => Boolean(v))
          .reduce((memo, [_, v]) => {
            if (!memo) return v
            return mergeValues(memo, v)
          }, null)

        const keyed = multiple.reduce((memo, [k, v]) => {
          memo.push({
            name: k,
            value: v ?? null,
          })
          return memo
        }, [])

        if (combined) return { ...combined, keyed }
      }

      if (items[name]) return items[name]
      if (items[search]) return items[search]
      if (wiki) return wikiParser(wiki)

      return payload ?? null
    }

    // attempt to match to TIMINGS
    let result = await Promise.all(
      TIMINGS.map(async (item) => {
        const payload = await resolve(item)

        return {
          name: item.name,
          time: item.time,
          coords: item.coords,
          skip: item.skip,
          duplicate: item.duplicate,
          search: item.search,
          payload,
        }
      })
    )

    result = result.reduce((memo, item) => {
      const accumulative = memo[memo.length - 1]?.accumulative ?? 0

      memo.push({
        ...item,
        accumulative:
          accumulative + (item?.duplicate ? 0 : item.payload?.totalCases ?? 0),
      })
      return memo
    }, [])

    result[result.length - 1].accumulative = mainNumber
    result[result.length - 1].payload = {
      totalCases: mainNumber - result[result.length - 2]?.accumulative,
      totalDeaths: 0,
      totalRecovered: 0,
    }
    res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate")
    res.setHeader("Content-Type", "application/json")
    res.send(JSON.stringify(result))
  } catch (err) {
    console.log(err)
    res.status(500)
    res.end()
  }
}
