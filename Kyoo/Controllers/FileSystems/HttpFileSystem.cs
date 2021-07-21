using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Kyoo.Common.Models.Attributes;
using Kyoo.Models;
using Microsoft.AspNetCore.Mvc;

namespace Kyoo.Controllers
{
	/// <summary>
	/// A <see cref="IFileSystem"/> for http/https links.
	/// </summary>
	[FileSystemMetadata(new [] {"http", "https"})]
	public class HttpFileSystem : IFileSystem
	{
		/// <summary>
		/// The http client factory used to create clients.
		/// </summary>
		private readonly IHttpClientFactory _clientFactory;

		/// <summary>
		/// Create a <see cref="HttpFileSystem"/> using the given client factory.
		/// </summary>
		/// <param name="factory">The http client factory used to create clients.</param>
		public HttpFileSystem(IHttpClientFactory factory)
		{
			_clientFactory = factory;
		}
		
		
		/// <inheritdoc />
		public IActionResult FileResult(string path, bool rangeSupport = false, string type = null)
		{
			if (path == null)
				return new NotFoundResult();
			return new HttpForwardResult(new Uri(path), rangeSupport, type);
		}

		/// <inheritdoc />
		public Task<Stream> GetReader(string path)
		{
			HttpClient client = _clientFactory.CreateClient();
			return client.GetStreamAsync(path);
		}

		/// <inheritdoc />
		public Task<Stream> NewFile(string path)
		{
			throw new NotSupportedException("An http filesystem is readonly, a new file can't be created.");
		}

		/// <inheritdoc />
		public Task<string> CreateDirectory(string path)
		{
			throw new NotSupportedException("An http filesystem is readonly, a directory can't be created.");
		}

		/// <inheritdoc />
		public string Combine(params string[] paths)
		{
			return Path.Combine(paths);
		}

		/// <inheritdoc />
		public Task<ICollection<string>> ListFiles(string path, SearchOption options = SearchOption.TopDirectoryOnly)
		{
			throw new NotSupportedException("Listing files is not supported on an http filesystem.");
		}

		/// <inheritdoc />
		public Task<bool> Exists(string path)
		{
			throw new NotSupportedException("Checking if a file exists is not supported on an http filesystem.");
		}

		/// <inheritdoc />
		public string GetExtraDirectory(Show show)
		{
			throw new NotSupportedException("Extras can not be stored inside an http filesystem.");
		}
	}

	/// <summary>
	/// An <see cref="IActionResult"/> to proxy an http request.
	/// </summary>
	public class HttpForwardResult : IActionResult
	{
		/// <summary>
		/// The path of the request to forward.
		/// </summary>
		private readonly Uri _path;
		/// <summary>
		/// Should the proxied result support ranges requests?
		/// </summary>
		private readonly bool _rangeSupport;
		/// <summary>
		/// If not null, override the content type of the resulting request.
		/// </summary>
		private readonly string _type;

		/// <summary>
		/// Create a new <see cref="HttpForwardResult"/>.
		/// </summary>
		/// <param name="path">The path of the request to forward.</param>
		/// <param name="rangeSupport">Should the proxied result support ranges requests?</param>
		/// <param name="type">If not null, override the content type of the resulting request.</param>
		public HttpForwardResult(Uri path, bool rangeSupport, string type = null)
		{
			_path = path;
			_rangeSupport = rangeSupport;
			_type = type;
		}

		/// <inheritdoc />
		public Task ExecuteResultAsync(ActionContext context)
		{
			// TODO implement that, example: https://github.com/twitchax/AspNetCore.Proxy/blob/14dd0f212d7abb43ca1bf8c890d5efb95db66acb/src/Core/Extensions/Http.cs#L15
			throw new NotImplementedException();
		}
	}
}